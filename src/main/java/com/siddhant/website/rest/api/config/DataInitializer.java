package com.siddhant.website.rest.api.config;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.siddhant.website.rest.api.entity.Category;
import com.siddhant.website.rest.api.entity.Product;
import com.siddhant.website.rest.api.entity.Role;
import com.siddhant.website.rest.api.repository.CategoryRepository;
import com.siddhant.website.rest.api.repository.ProductRepository;
import com.siddhant.website.rest.api.repository.RoleRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Seeds default roles and, on an empty database, a product catalogue.
 * The catalogue is imported from DummyJSON (public demo API) and falls back to a small local list
 * when the network is unavailable. Disable with app.seed-demo-data=false.
 */
@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RemoteProduct(String title, String description, double price, String category, String thumbnail) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    record RemoteResponse(List<RemoteProduct> products) {}

    @Bean
    CommandLineRunner seedRoles(RoleRepository roleRepository) {
        return args -> List.of("USER", "ADMIN").forEach(name -> {
            if (roleRepository.findByName(name).isEmpty()) {
                roleRepository.save(new Role(null, name));
                log.info("Seeded role {}", name);
            }
        });
    }

    @Bean
    CommandLineRunner seedCatalogue(CategoryRepository categories,
                                    ProductRepository products,
                                    @Value("${app.seed-demo-data:true}") boolean enabled,
                                    @Value("${app.seed-source-url:https://dummyjson.com/products?limit=100}") String sourceUrl,
                                    @Value("${app.seed-usd-to-inr:85}") double usdToInr) {
        return args -> {
            if (!enabled || categories.count() > 0) {
                return;
            }
            Map<String, List<RemoteProduct>> byCategory = fetchRemote(sourceUrl);
            boolean remote = !byCategory.isEmpty();
            if (!remote) {
                log.warn("Could not reach {}: using the built-in sample catalogue", sourceUrl);
                byCategory = sampleCatalogue();
            }

            int count = 0;
            for (Map.Entry<String, List<RemoteProduct>> entry : byCategory.entrySet()) {
                List<RemoteProduct> items = entry.getValue();
                Category category = new Category();
                category.setName(prettify(entry.getKey()));
                category.setImage(items.get(0).thumbnail());
                category = categories.save(category);

                for (RemoteProduct item : items) {
                    Product product = new Product();
                    product.setName(item.title());
                    product.setDescription(truncate(item.description(), 255));
                    product.setImage(item.thumbnail());
                    product.setPrice(remote ? Math.round(item.price() * usdToInr) : item.price());
                    product.setCategory(category);
                    products.save(product);
                    count++;
                }
            }
            log.info("Seeded {} products in {} categories ({})", count, byCategory.size(), remote ? "DummyJSON" : "sample");
        };
    }

    private Map<String, List<RemoteProduct>> fetchRemote(String url) {
        try {
            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(5000);
            factory.setReadTimeout(10000);
            RemoteResponse response = RestClient.builder().requestFactory(factory).build()
                    .get().uri(url).retrieve().body(RemoteResponse.class);
            Map<String, List<RemoteProduct>> grouped = new LinkedHashMap<>();
            if (response != null && response.products() != null) {
                for (RemoteProduct p : response.products()) {
                    if (p.title() != null && p.category() != null) {
                        grouped.computeIfAbsent(p.category(), k -> new java.util.ArrayList<>()).add(p);
                    }
                }
            }
            return grouped;
        } catch (Exception e) {
            log.warn("Catalogue download failed: {}", e.getMessage());
            return Map.of();
        }
    }

    private Map<String, List<RemoteProduct>> sampleCatalogue() {
        Map<String, List<RemoteProduct>> m = new LinkedHashMap<>();
        m.put("home", List.of(
                new RemoteProduct("Ceramic Mug", "Hand-finished stoneware mug.", 899, "home", null),
                new RemoteProduct("Linen Throw", "Soft washed linen throw.", 2499, "home", null)));
        m.put("apparel", List.of(
                new RemoteProduct("Cotton Tee", "Heavyweight organic cotton tee.", 1299, "apparel", null),
                new RemoteProduct("Wool Beanie", "Merino wool, one size.", 999, "apparel", null)));
        return m;
    }

    private static String prettify(String slug) {
        StringBuilder sb = new StringBuilder();
        for (String part : slug.split("[-_ ]+")) {
            if (part.isEmpty()) continue;
            if (sb.length() > 0) sb.append(' ');
            sb.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1));
        }
        return sb.toString();
    }

    private static String truncate(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max - 1) + "…";
    }
}

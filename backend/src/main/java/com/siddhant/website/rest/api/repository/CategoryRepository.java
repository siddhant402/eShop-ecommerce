package com.siddhant.website.rest.api.repository;

import com.siddhant.website.rest.api.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}

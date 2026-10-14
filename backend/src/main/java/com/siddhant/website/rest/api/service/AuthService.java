package com.siddhant.website.rest.api.service;

import com.siddhant.website.rest.api.entity.Role;
import com.siddhant.website.rest.api.payload.LoginDto;
import com.siddhant.website.rest.api.payload.RegisterDto;

import java.util.List;

import java.util.List;

public interface AuthService {
    String login(LoginDto loginDto);
    String register(RegisterDto registerDto);
    String createRole(Role role);
    String deleteRole(String name);
    List<Role> getAllRoles();
    String getRoleByName(String name);

}

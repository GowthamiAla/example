package com.mss.solar.core.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.core.domain.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
	
	Role findByName(String name);

	Role findById(Long id);

}

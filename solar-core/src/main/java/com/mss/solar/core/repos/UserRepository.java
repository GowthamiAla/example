package com.mss.solar.core.repos;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.core.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
	User findByName(String name);

	User findByEmail(String email);

	User findByPhone(String phone);

	User findByPassword(String password);

	User findByEmailAndPassword(String email, String password);

	User findById(Long id);
	
	Collection<User> findByActive(Boolean active);

	List<User> findAllByRolesNameIn(Collection<String> roles);

}

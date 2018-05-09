package com.mss.solar.dashboard.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.dashboard.domain.User;

public interface UserRepository extends JpaRepository<User, Long> {
	

	User findByEmail(String email);

	User findByPhone(String phone);

	

}

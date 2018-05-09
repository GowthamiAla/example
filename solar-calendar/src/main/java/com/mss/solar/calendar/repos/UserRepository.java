package com.mss.solar.calendar.repos;

import java.util.Collection;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.calendar.domain.User;



public interface UserRepository extends JpaRepository<User, Long> {
	User findByName(String name);

	User findByEmail(String email);

	

}

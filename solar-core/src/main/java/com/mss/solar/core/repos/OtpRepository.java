package com.mss.solar.core.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mss.solar.core.domain.Otp;
import com.mss.solar.core.domain.User;

public interface OtpRepository extends JpaRepository<Otp, Long> {

	Otp findOneByUser(User user);
	
	Otp findOneByUserId(Integer id);
	
	Otp findOneByUserAndCode(User user, Integer otpStr);
	
	Otp findUserByCode(Integer otpStr);
}

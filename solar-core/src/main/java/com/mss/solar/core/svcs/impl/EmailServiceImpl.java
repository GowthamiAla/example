package com.mss.solar.core.svcs.impl;

import java.io.FileOutputStream;
import java.util.Base64;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.activation.DataHandler;
import javax.activation.DataSource;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.mss.solar.core.common.EnumTypeForErrorCodes;
import com.mss.solar.core.common.Utils;
import com.mss.solar.core.domain.User;
import com.mss.solar.core.model.ServiceResponse;
import com.mss.solar.core.repos.UserRepository;
import com.mss.solar.core.svcs.EmailService;

@Service
@RestController
public class EmailServiceImpl implements EmailService{
	
	private Logger log = LoggerFactory.getLogger(this.getClass());
	
	@Autowired
	private UserRepository userRepo;

	@Autowired
	private JavaMailSender mailSender;
	
	@Autowired
	private Utils utils;

	@Value("${images.url}")
	public String imagesUrl;

	/**
	 * notifyUser service implementation
	 * 
	 * @param userId
	 * @param payload
	 * @return ServiceResponse<String>
	 */
	@Async
	@Override
	public ServiceResponse<String> notifyUser(@PathVariable("userId") Long userId,
			@PathVariable("payload") String payload) {

		ServiceResponse<String> response = new ServiceResponse<>();
		try {
			User user = userRepo.findOne(userId);
			if (payload.contains("base64") == false) {
				MimeMessage mail = mailSender.createMimeMessage();
				MimeMessageHelper helper = new MimeMessageHelper(mail, true);
				helper.setTo(user.getEmail());
				helper.setSubject("Notification");

				helper.setText("text/html", payload);
				mailSender.send(mail);
				response.setData("Mail Sent Successfully");
			} else {
				notifyUserByImage(user.getEmail(), payload);
			}
		} catch (Exception e) {

			response.setError(EnumTypeForErrorCodes.SCUS201.name(), EnumTypeForErrorCodes.SCUS201.errorMsg());

			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * notifyUserByEmail service implementation
	 * 
	 * @param email
	 * @param payload
	 * @return ServiceResponse<String>
	 */
	@Async
	@Override
	public ServiceResponse<String> notifyUserByEmail(@PathVariable("email") String email,
			@PathVariable("payload") String payload) {

		ServiceResponse<String> response = new ServiceResponse<>();
		try {
			if (payload.contains("base64") == false) {
				MimeMessage mail = mailSender.createMimeMessage();
				MimeMessageHelper helper = new MimeMessageHelper(mail, true);
				helper.setSubject("Notification");
				helper.setTo(email);
				helper.setText("text/html", payload);
				mailSender.send(mail);
				response.setData("Mail Sent Successfully");
			} else {
				notifyUserByImage(email, payload);
			}
		} catch (Exception e) {

			response.setError(EnumTypeForErrorCodes.SCUS201.name(), EnumTypeForErrorCodes.SCUS201.errorMsg());

			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

	/**
	 * notifyUserByImage service implementation
	 * 
	 * @param userId
	 * @param payload
	 * @return ServiceResponse<String>
	 */
	@Async
	@Override
	public ServiceResponse<String> notifyUserByImage(@PathVariable("email") String email,
			@PathVariable("payload") String payload) {

		ServiceResponse<String> response = new ServiceResponse<>();

		try {
			MimeMessage message = mailSender.createMimeMessage();
			message.setRecipients(Message.RecipientType.TO, email);
			message.setSubject("Notification");
			message.setSentDate(new Date());

			MimeMultipart multipart = new MimeMultipart("related");

			/*
			 * BodyPart messageBodyPart = new MimeBodyPart();
			 * messageBodyPart.setContent(payload, "text/html");
			 * multipart.addBodyPart(messageBodyPart);
			 */

			String regexString = Pattern.quote("base64,") + "(.*?)" + Pattern.quote("\"");

			Matcher matcher = Pattern.compile(regexString).matcher(payload);
			int i = 1;
			while (matcher.find()) {

				String result = matcher.group().substring(matcher.group().indexOf("base64,") + 7,
						matcher.group().indexOf('"'));

				if (result.isEmpty() == false) {
					FileOutputStream imageOutFile = new FileOutputStream(imagesUrl + i + ".jpg");
					byte[] imageByteArray = Base64.getDecoder().decode(result);
					imageOutFile.write(imageByteArray);
					imageOutFile.close();

					String contentId = Integer.toString(i);

					BodyPart messageBodyPart = new MimeBodyPart();
					messageBodyPart.setContent(payload + "<img src=\"cid:" + contentId + "\">", "text/html");
					multipart.addBodyPart(messageBodyPart);

					BodyPart imageBodyPart = new MimeBodyPart();
					DataSource fds = new FileDataSource(imagesUrl + i + ".jpg");
					imageBodyPart.setDataHandler(new DataHandler(fds));
					imageBodyPart.addHeader("Content-ID", "<" + contentId + ">");
					multipart.addBodyPart(imageBodyPart);

				}
				i++;

			}

			message.setContent(multipart);
			mailSender.send(message);
			response.setData("Mail Sent Successfully");

		} catch (Exception e) {

			response.setError(EnumTypeForErrorCodes.SCUS201.name(), EnumTypeForErrorCodes.SCUS201.errorMsg());

			log.error(utils.toJson(response.getError()), e);
		}
		return response;
	}

}

package com.saran.TraineeManagementSystem.services.serviceImpl;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.saran.TraineeManagementSystem.Dtos.RegisterAssociateDto;
import com.saran.TraineeManagementSystem.Dtos.Response;
import com.saran.TraineeManagementSystem.models.BHTrainer;
import com.saran.TraineeManagementSystem.models.Coach;
import com.saran.TraineeManagementSystem.models.Mentor;
import com.saran.TraineeManagementSystem.models.RegisterAssociate;
import com.saran.TraineeManagementSystem.models.TechnicalTrainer;
import com.saran.TraineeManagementSystem.models.UserRoles;
import com.saran.TraineeManagementSystem.Repositories.BHTrainerRepository;
import com.saran.TraineeManagementSystem.Repositories.CoachRepository;
import com.saran.TraineeManagementSystem.Repositories.MentorRepository;
import com.saran.TraineeManagementSystem.Repositories.RegisterAssociateRepository;
import com.saran.TraineeManagementSystem.Repositories.TechTrainerRepository;
import com.saran.TraineeManagementSystem.services.AdminService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AdminServiceimpl implements AdminService {

	private final JavaMailSender mailSender;
	private final RegisterAssociateRepository associateRepository;
	private final ModelMapper modelMapper;

	@Value("${spring.mail.username}")
	private String fromMail;

	private String mailForTesting = "jayasaideep@gmail.com";
	
	 @Autowired // Use @Autowired for PasswordEncoder as a bean
	 private PasswordEncoder passwordEncoder;
	 
	 @Autowired
	 private TechTrainerRepository techTrainerRepository;
	 
	 @Autowired
	 private BHTrainerRepository bhTrainerRepository;
	 
	 @Autowired
	 private MentorRepository mentorRepository;
	    
	 @Autowired
	 private CoachRepository coachRepository;
	 
	 

	// Constructor Injection for dependencies
	public AdminServiceimpl(JavaMailSender mailSender, RegisterAssociateRepository associateRepository, ModelMapper modelMapper) {
		this.mailSender = mailSender;
		this.associateRepository = associateRepository;
		this.modelMapper = modelMapper;
	}

	
	@Override
	public Response sendMail(RegisterAssociateDto registerAssociateDto, String actionType, String specificDetails) {

		SimpleMailMessage mess = new SimpleMailMessage();
		mess.setFrom(fromMail);
		mess.setTo(registerAssociateDto.getAssociateEmail().trim());

		StringBuilder emailBodyBuilder = new StringBuilder();
		emailBodyBuilder.append("Dear ").append(registerAssociateDto.getAssociateName()).append(",\n\n");

		SimpleMailMessage messagefortesting = new SimpleMailMessage();
		mess.setFrom(fromMail);
		mess.setTo(mailForTesting);

//		String temporaryPassword = "";
//		if (!"DELETE".equals(actionType)) {
//			temporaryPassword = generateTemporaryPassword(); // Only generate password if not deleting
//		}

		switch (actionType) {
			case "REGISTER":
				
				mess.setSubject("GenC Training Management Portal Credentials - " + registerAssociateDto.getAssociateId());
				emailBodyBuilder.append("Welcome to the GenC Training Management Portal!\n\n");
				emailBodyBuilder.append("Here are your login credentials:\n");
				emailBodyBuilder.append("Username: ").append(registerAssociateDto.getAssociateEmail()).append("\n");
				emailBodyBuilder.append("Temporary Password: ").append(registerAssociateDto.getPassword()).append("\n");
				emailBodyBuilder.append("Your assigned role: ").append(registerAssociateDto.getRole().name()).append("\n\n");
				emailBodyBuilder.append("Please log in using these credentials and change your password immediately.\n\n");

				messagefortesting.setSubject("GenC Training Management Portal Credentials - here are the details for testing " + registerAssociateDto.getAssociateId());

				break;

			case "UPDATE":
				mess.setSubject("GenC Training Management Portal Profile Update - " + registerAssociateDto.getAssociateId());
				emailBodyBuilder.append("Your profile details have been updated in the GenC Training Management Portal:\n\n");
				emailBodyBuilder.append(specificDetails).append("\n"); // Add the specific update details
				emailBodyBuilder.append("Your login credentials are as follows:\n");
				emailBodyBuilder.append("Username: ").append(registerAssociateDto.getAssociateEmail()).append("\n");
				emailBodyBuilder.append("Temporary Password: ").append(registerAssociateDto.getPassword()).append("\n");
				emailBodyBuilder.append("Your assigned role: ").append(registerAssociateDto.getRole().name()).append("\n\n");
				emailBodyBuilder.append("Please log in using these credentials and change your password immediately.\n\n");

				messagefortesting.setSubject("GenC Training Management Portal Credentials updated - here are the details for testing " + registerAssociateDto.getAssociateId());

				break;

			case "DELETE":
				mess.setSubject("GenC Training Management Portal Account Deletion Notification");
				emailBodyBuilder.append(specificDetails).append("\n\n"); // This will contain the deletion message
				emailBodyBuilder.append("If you believe this is an error, please contact the administrator.\n\n");

				messagefortesting.setSubject("GenC Training Management Portal - associate deleted " );

				break;

			default:
				// Fallback or error case
				mess.setSubject("GenC Training Management Portal Notification");
				emailBodyBuilder.append("A notification regarding your account in the GenC Training Management Portal.\n\n");
				emailBodyBuilder.append(specificDetails).append("\n\n");
				break;
		}

		emailBodyBuilder.append("If you have any questions, please contact the administrator.\n\n");
		emailBodyBuilder.append("Regards,\n");
		emailBodyBuilder.append("GenC Training Management Team");

		mess.setText(emailBodyBuilder.toString());

		messagefortesting.setText(emailBodyBuilder.toString());

		try {
			mailSender.send(mess);
			System.out.println("Email sent successfully to: " + registerAssociateDto.getAssociateEmail());

			mailSender.send(messagefortesting);
			System.out.println("Email sent to harikuchipudi1@gmail.com for testing");

			return Response.builder()
					.status(HttpStatus.OK.value())
					.message("Email notification sent successfully to: " + registerAssociateDto.getAssociateEmail())
					.build();


		} catch (Exception e) {
			System.err.println("Error sending email to " + registerAssociateDto.getAssociateEmail() + ": " + e.getMessage());
			return Response.builder()
					.status(HttpStatus.INTERNAL_SERVER_ERROR.value())
					.message("Failed to send email notification to " + registerAssociateDto.getAssociateEmail() + ": " + e.getMessage())
					.build();
		}
	}

	
	private String generateTemporaryPassword() {
		return UUID.randomUUID().toString().substring(0, 10); // Example: 10 characters long
	}


	
	@Override
	public Response addAssociate(RegisterAssociateDto associateDto) {

		Optional<RegisterAssociate> existingAssociateById = associateRepository.findByAssociateId(associateDto.getAssociateId());
		if (existingAssociateById.isPresent()) {
			return Response.builder()
					.status(HttpStatus.CONFLICT.value())
					.message("Associate with ID " + associateDto.getAssociateId() + " already exists.")
					.build();
		}

		Optional<RegisterAssociate> existingAssociateByEmail = associateRepository.findByAssociateEmail(associateDto.getAssociateEmail());
		if (existingAssociateByEmail.isPresent()) {
			return Response.builder()
					.status(HttpStatus.CONFLICT.value())
					.message("Associate with email " + associateDto.getAssociateEmail() + " already exists.")
					.build();
		}

		RegisterAssociate associate = modelMapper.map(associateDto, RegisterAssociate.class);
		String password = generateTemporaryPassword();
        System.out.println("Temp password : "+ password);
		String tempPassword = password;
		password = passwordEncoder.encode(password);
		
		
		
		associate.setPassword(password);
		RegisterAssociate savedAssociate = associateRepository.save(associate);
		associateDto.setPassword(tempPassword);
		
		// Attempt to send mail for initial registration
		Response mailResponse = sendMail(associateDto, "REGISTER", "");
		
		if(associateDto.getRole()==UserRoles.TECHNICAL_TRAINER) {
			TechnicalTrainer technicalTrainer = new TechnicalTrainer();
			technicalTrainer.setTechTrainerAssociateId(associateDto.getAssociateId());
			technicalTrainer.setTechTrainerEmail(associateDto.getAssociateEmail());
			technicalTrainer.setTechTrainerName(associateDto.getAssociateName());
			technicalTrainer.setDescription(associateDto.getDescription());
			techTrainerRepository.save(technicalTrainer);
		}
		else if(associateDto.getRole() == UserRoles.BH_TRAINER) {
			BHTrainer bhtrainer = new BHTrainer();
			bhtrainer.setBhTrainerAssociateId(associateDto.getAssociateId());
			bhtrainer.setBhTrainerName(associateDto.getAssociateName());
			bhtrainer.setBhTrainerEmail(associateDto.getAssociateEmail());
			bhTrainerRepository.save(bhtrainer);
		}
		else if(associateDto.getRole() == UserRoles.MENTOR) {
			Mentor mentor = new Mentor();
			mentor.setMentorAssociateId(associateDto.getAssociateId());
			mentor.setMentorEmail(associateDto.getAssociateEmail());
			mentor.setMentorName(associateDto.getAssociateName());
			mentorRepository.save(mentor);
		}
		else if(associateDto.getRole() == UserRoles.COACH) {
			Coach coach = new Coach();
			coach.setCoachAssociateId(associateDto.getAssociateId());
			coach.setCoachEmail(associateDto.getAssociateEmail());
			coach.setCoachName(associateDto.getAssociateName());
			coachRepository.save(coach);
		}
		

		

		// Combine messages for the final response
		String finalMessage = "Associate added successfully.";
		if (mailResponse.getStatus() != HttpStatus.OK.value()) {
			finalMessage += " However, " + mailResponse.getMessage();
		} else {
			finalMessage += " " + mailResponse.getMessage();
		}

		return Response.builder()
				.status(HttpStatus.CREATED.value())
				.message(finalMessage)
				.registeredAssociate(modelMapper.map(savedAssociate, RegisterAssociateDto.class))
				.build();
	}

	@Override
	public Response getAssociateById(Long id) {
		Optional<RegisterAssociate> optionalAssociate = associateRepository.findById(id);

		if (optionalAssociate.isPresent()) {
			RegisterAssociateDto associateDto = modelMapper.map(optionalAssociate.get(), RegisterAssociateDto.class);
			return Response.builder()
					.status(HttpStatus.OK.value())
					.message("Associate retrieved successfully.")
					.registeredAssociate(associateDto)
					.build();
		} else {
			return Response.builder()
					.status(HttpStatus.NOT_FOUND.value())
					.message("Associate with ID " + id + " not found.")
					.build();
		}
	}

	@Override
	public Response getAllAssociates() {
		List<RegisterAssociateDto> associates = associateRepository.findAll().stream()
				.map(associate -> {
					RegisterAssociateDto dto = new RegisterAssociateDto();
					dto.setid(associate.getId());
					dto.setAssociateId(associate.getAssociateId());
					dto.setAssociateName(associate.getAssociateName());
					dto.setAssociateEmail(associate.getAssociateEmail());
					dto.setRole(associate.getRole());
					return dto;
				})
				.collect(Collectors.toList());

		System.out.println(associates.size());

		if (associates.isEmpty()) {
			return Response.builder()
					.status(HttpStatus.NOT_FOUND.value())
					.message("No associates found.")
					.build();
		}

		return Response.builder()
				.status(HttpStatus.OK.value())
				.message("All associates retrieved successfully.")
				.registeredAssociates(associates)
				.build();
	}

	
	@Override
	public Response updateAssociate(Long id, RegisterAssociateDto updatedAssociateDto) {
		Optional<RegisterAssociate> existingAssociateOptional = associateRepository.findById(id);

		if (existingAssociateOptional.isEmpty()) {
			return Response.builder()
					.status(HttpStatus.NOT_FOUND.value())
					.message("Associate with ID " + id + " not found for update.")
					.build();
		}

		RegisterAssociate existingAssociate = existingAssociateOptional.get();

		// --- Identify what's getting updated ---
		StringBuilder changes = new StringBuilder();
		boolean hadChanges = false;

		if (!existingAssociate.getAssociateName().equals(updatedAssociateDto.getAssociateName())) {
			changes.append("- Associate Name: '").append(existingAssociate.getAssociateName())
				   .append("' changed to '").append(updatedAssociateDto.getAssociateName()).append("'\n");
			hadChanges = true;
		}
		if (!existingAssociate.getAssociateId().equals(updatedAssociateDto.getAssociateId())) {
			changes.append("- Associate ID: '").append(existingAssociate.getAssociateId())
				   .append("' changed to '").append(updatedAssociateDto.getAssociateId()).append("'\n");
			hadChanges = true;
		}
		// Compare emails, but note that the email will be sent to updatedAssociateDto.getAssociateEmail()
		if (!existingAssociate.getAssociateEmail().equals(updatedAssociateDto.getAssociateEmail())) {
			changes.append("- Associate Email: '").append(existingAssociate.getAssociateEmail())
				   .append("' changed to '").append(updatedAssociateDto.getAssociateEmail()).append("'\n");
			hadChanges = true;
		}
		if (!existingAssociate.getRole().equals(updatedAssociateDto.getRole())) {
			changes.append("- Role: '").append(existingAssociate.getRole().name())
				   .append("' changed to '").append(updatedAssociateDto.getRole().name()).append("'\n");
			hadChanges = true;
		}

		String updateDetails = hadChanges ? changes.toString() : "No specific profile details were changed.";


		// --- Apply updates and save ---
		existingAssociate.setAssociateName(updatedAssociateDto.getAssociateName());
		existingAssociate.setAssociateId(updatedAssociateDto.getAssociateId());
		existingAssociate.setAssociateEmail(updatedAssociateDto.getAssociateEmail());
		existingAssociate.setRole(updatedAssociateDto.getRole());

		RegisterAssociate savedAssociate = associateRepository.save(existingAssociate);
		RegisterAssociateDto savedAssociateDto = modelMapper.map(savedAssociate, RegisterAssociateDto.class);

		// Automatically trigger mail sending after update, passing the update details
		Response mailResponse = sendMail(savedAssociateDto, "UPDATE", updateDetails);

		// Combine messages for the final response
		String finalMessage = "Associate updated successfully.";
		if (mailResponse.getStatus() != HttpStatus.OK.value()) {
			finalMessage += " However, " + mailResponse.getMessage();
		} else {
			finalMessage += " " + mailResponse.getMessage();
		}

		return Response.builder()
				.status(HttpStatus.OK.value())
				.message(finalMessage)
				.registeredAssociate(savedAssociateDto)
				.build();
	}

	
	@Override
	@Transactional
	public Response deleteAssociate(Long id) {
		Optional<RegisterAssociate> existingAssociateOptional = associateRepository.findById(id);

		if (existingAssociateOptional.isEmpty()) {
			return Response.builder()
					.status(HttpStatus.NOT_FOUND.value())
					.message("Associate with ID " + id + " not found for deletion.")
					.build();
		}

		RegisterAssociate associateToDelete = existingAssociateOptional.get();
		RegisterAssociateDto associateDto = modelMapper.map(associateToDelete, RegisterAssociateDto.class);
		
		if(associateDto.getRole()==UserRoles.TECHNICAL_TRAINER) {
			techTrainerRepository.deleteByTechTrainerAssociateId(associateDto.getAssociateId());
		}
		else if(associateDto.getRole() == UserRoles.BH_TRAINER) {
			bhTrainerRepository.deleteByBhTrainerAssociateId(associateDto.getAssociateId());
		}
		else if(associateDto.getRole() == UserRoles.COACH) {
			coachRepository.deleteByCoachAssociateId(associateDto.getAssociateId());
		}
		else if(associateDto.getRole() == UserRoles.MENTOR) {
			mentorRepository.deleteByMentorAssociateId(associateDto.getAssociateId());
		}
		
		// Perform the deletion
		associateRepository.deleteById(id);
		
		

		// Construct the deletion message
		String deletionMessage = "Your account associated with email " + associateDto.getAssociateEmail()
								+ " and Associate ID " + associateDto.getAssociateId()
								+ " has been deleted from the GenC Training Management Portal. "
								+ "You will no longer be able to log in.";

		// Send email notification about the deletion
		Response mailResponse = sendMail(associateDto, "DELETE", deletionMessage);

		// Combine messages for the final response
		String finalMessage = "Associate deleted successfully.";
		if (mailResponse.getStatus() != HttpStatus.OK.value()) {
			finalMessage += " However, " + mailResponse.getMessage();
		} else {
			finalMessage += " " + mailResponse.getMessage();
		}

		return Response.builder()
				.status(HttpStatus.OK.value())
				.message(finalMessage)
				.build();
	}
}

package com.exe.super_rice.service.auth;

import com.exe.super_rice.database.entity.Users;
import com.exe.super_rice.database.repository.UserRepository;
import com.exe.super_rice.dto.request.IntrospectRequest;
import com.exe.super_rice.dto.request.LoginRequest;
import com.exe.super_rice.dto.response.IntrospectResponse;
import com.exe.super_rice.enums.AuthProvider;
import com.exe.super_rice.enums.ErrorCode;
import com.exe.super_rice.enums.UserRole;
import com.exe.super_rice.exception.AppException;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.text.ParseException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthServiceImp implements AuthService {
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;
    @NonFinal
    @Value("${zalo.appId}")
    protected String zaloAppId;

    @NonFinal
    @Value("${zalo.appSecret}")
    protected String zaloAppSecret;

    @NonFinal
    @Value("${zalo.redirectUri}")
    protected String zaloRedirectUri;

    @Override
    public String login(LoginRequest request) {
        try {
            Users user = userRepository.findByEmail(request.getEmail());
            if (user == null) {
                log.error("NOT FOUND:" + request.getEmail());
            }
            boolean authenticate = passwordEncoder.matches(request.getPassword(), user.getPassword());
//            if(!user.isActive()){
//                log.error("Your account is Inactive");
//                return "Your account is Inactive";
//            }
            if (!authenticate) {
                log.error("Wrong username or password, please check your information");
                return "Wrong username or password, please check your information";
            }
            String token = generateToken(user);
            return token;
        } catch (Exception e) {
            log.error("Error by: " + e);
            return "Wrong username or password, please check your information";

        }
    }

    @Override
    @Transactional
    public String createAccount(LoginRequest request) {
        try {
            Users existedAccount = userRepository.findByEmail(request.getEmail());
            if (existedAccount != null) {
                System.out.println("Username existed1");

            }


            Users user = new Users();
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);

            return user.getEmail();
        } catch (Exception e) {
            System.out.println("Username existed");
            return null;
        }
    }

    public IntrospectResponse introspect(IntrospectRequest request) {
        var token = request.getToken();
        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException | JOSEException | ParseException e) {
            isValid = false;
        }

        return IntrospectResponse.builder().valid(isValid).build();
    }

    private String generateToken(Users user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);


        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getEmail())
                .issueTime(new Date())
                .expirationTime(Date.from(LocalDateTime.now().plusSeconds(3600).atZone(ZoneId.systemDefault()).toInstant()))
                .jwtID(UUID.randomUUID().toString())
                .claim("id", user.getId())
                .claim("scope", user.getRole())
                .build();

        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            System.out.println("Error by: " + e);
        }
        return "";
    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = (isRefresh)
                ? new Date(signedJWT
                .getJWTClaimsSet()
                .getIssueTime()
                .toInstant()
                .plusSeconds(3600).atZone(ZoneId.systemDefault()).toInstant().toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        if (!(verified && expiryTime.after(new Date()))) throw new AppException(ErrorCode.UNAUTHENTICATED);


        return signedJWT;
    }

    public String handleSocialLogin(String email, String fullName, String avatarUrl, AuthProvider provider) {
        Users user = userRepository.findByEmail(email);

        if (user == null) {
            user = Users.builder()
                    .email(email)
                    .fullName(fullName)
                    .avatarUrl(avatarUrl)
                    .role(UserRole.CUSTOMER)
                    .authProvider(provider)
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(user);
        }

        return generateToken(user);
    }

    public String handleZaloLogin(String code) {
        RestTemplate restTemplate = new RestTemplate();

        Map<String, String> tokenRequest = Map.of(
                "app_id", zaloAppId,
                "app_secret", zaloAppSecret,
                "code", code
        );

        var tokenResponse = restTemplate.postForObject(
                "https://oauth.zaloapp.com/v4/access_token",
                tokenRequest,
                Map.class
        );

        String accessToken = (String) tokenResponse.get("access_token");

        Map userInfo = restTemplate.getForObject(
                "https://graph.zalo.me/v2.0/me?access_token=" + accessToken,
                Map.class
        );

        String zaloId = (String) userInfo.get("id");
        String name = (String) userInfo.get("name");
        String avatar = ((Map<String, Object>) ((Map<String, Object>) userInfo.get("picture")).get("data")).get("url").toString();
        String email = zaloId + "@zalo.com";

        return handleSocialLogin(email, name, avatar, AuthProvider.ZALO);
    }

}

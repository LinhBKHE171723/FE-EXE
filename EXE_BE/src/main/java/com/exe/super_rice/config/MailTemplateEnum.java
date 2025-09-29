package com.exe.super_rice.config;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
public enum MailTemplateEnum {
    /** reset password template */
    CHANGE_PWD(MailTemplates.RESET_PASSWORD_TITLE, MailTemplates.RESET_PASSWORD_TEMPLATE),
    /** test mail template */
    SEND_EMAIL_TEST(MailTemplates.SEND_EMAIL_TEST_TITLE, MailTemplates.SEND_EMAIL_TEST_TEMPLATE);

    /** Mail subject */
    private final String subject;

    /** Mail content template */
    private final String template;

    MailTemplateEnum(String subject, String template) {
        this.subject = subject;
        this.template = template;
    }
}

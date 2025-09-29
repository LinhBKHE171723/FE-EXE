package com.exe.super_rice.config;

import lombok.experimental.UtilityClass;

@UtilityClass
public class MailTemplates {
    /** Mail subject for changing password */
    public static final String RESET_PASSWORD_TITLE = "【太陽油化基幹システム】パスワードリセットのお知らせ";

    /** Mail template for changing password */
    public static final String RESET_PASSWORD_TEMPLATE = """
            <p>太陽油化基幹システムのパスワードリセットの申請を受け付けました。</p>
            <br>
            <p>仮パスワードを発行しています。</p>
            <p>仮パスワード/：<span style="color:red;">${newPassword}</span></p>
            <br>
            <p>ログイン後、画面右上のユーザープロファイルよりパスワードを変更してください。</p>
            <p><a href="${domain}/login">${domain}/login</a></p>
            <br>
            <br>
            <br>
            <hr>
            <p style="font-size: 12px; color: gray;">
                ※本メールは、自動送信しております。<br>
                こちらのメールは送信専用のため、直接ご返信いただいても対応できませんので、<br>
                あらかじめご了承ください。
            </p>
            <br>
            <hr>
            """;

    /** Mail subject for sending mail test */
    public static final String SEND_EMAIL_TEST_TITLE = "【太陽油化基幹システム】テストメール受信のご確認";

    /** Mail template for sending mail test */
    public static final String SEND_EMAIL_TEST_TEMPLATE = """
            テストメール送信
            <br>
            <br>
            このメールは太陽油化基幹システムから送信するメールが、
            ご入力されたメールアドレスで受信可能か確認するためお客様の操作により自動送信されました。
            <br>
            <br>
            このメールの受信をもって受信確認は完了となります。
            <br>
            <br>
            <hr>
            <p style="font-size: 12px; color: gray;">
                ※本メールは、自動送信しております。<br>
                こちらのメールは送信専用のため、直接ご返信いただいても<br>
                対応できませんので、あらかじめご了承ください。
            </p>
            <br>
            <hr>
            """;
}

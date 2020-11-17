package com.example.tursuapp.authentication.login

import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.example.tursuapp.MainActivity
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RequestService
import com.example.tursuapp.api.requests.LoginRequest
import com.example.tursuapp.authentication.AuthenticationValidator
import com.example.tursuapp.authentication.forgotpassword.ForgotPasswordActivity
import com.example.tursuapp.authentication.signup.SignUpActivity
import io.reactivex.android.schedulers.AndroidSchedulers
import io.reactivex.disposables.CompositeDisposable

class LoginActivity : AppCompatActivity() {
    private lateinit var email : EditText
    private lateinit var password: EditText
    private lateinit var requestService : RequestService
    private val disposable = CompositeDisposable()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        email = findViewById(R.id.login_email)
        password = findViewById(R.id.login_password)

        requestService = ApiService.getInstance()

        findViewById<TextView>(R.id.register_button).setOnClickListener {
            startActivity(Intent(this, SignUpActivity::class.java))
        }

        findViewById<TextView>(R.id.forgot_password_button).setOnClickListener {
            startActivity(Intent(this, ForgotPasswordActivity::class.java))
        }

        findViewById<Button>(R.id.login_button).apply {
            this.setOnClickListener {
                login(this)
            }
        }

    }

    private fun login(button: Button){
        when{
            !AuthenticationValidator.validateEmail(email = email.text.toString()) ->
                print("Please enter a valid email!") // TO-DO: Warning Layout
        }

        disposable.add(
                requestService.login(
                        LoginRequest(
                                email = email.text.toString(),
                                password = password.text.toString()
                        )
                ).observeOn(AndroidSchedulers.mainThread())
                        .subscribe({
                            startActivity(Intent(this,MainActivity::class.java))
                        }, {
                            // Set warning!
                        })

        )

    }

}
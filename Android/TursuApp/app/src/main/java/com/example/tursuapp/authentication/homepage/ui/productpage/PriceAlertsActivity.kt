package com.example.tursuapp.authentication.homepage.ui.productpage

import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import com.example.tursuapp.R
import com.example.tursuapp.adapter.PriceAlertAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.PriceAlertResponse
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response

class PriceAlertsActivity: AppCompatActivity() {
    private lateinit var priceAlertCheckbox: CheckBox
    private lateinit var priceAlertEditText: EditText
    private lateinit var priceAlertButton: Button
    private lateinit var priceAlertListView: ListView
    private lateinit var noPriceAlertText: TextView
    private var productId: Int = 0
    private var authToken: String = ""

    var priceAlertList = ArrayList<PriceAlertResponse>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_price_alerts)

        val extras = intent.extras
        productId = extras?.getInt("productId", 0)!!
        val pref = applicationContext?.getSharedPreferences("UserPref", 0)
        authToken = pref?.getString("auth_token", null).toString()

        priceAlertCheckbox = findViewById(R.id.priceAlertCheckBox)
        priceAlertEditText = findViewById(R.id.priceAlertEditText)
        priceAlertButton = findViewById(R.id.addPriceAlertButton)
        priceAlertListView = findViewById(R.id.priceAlertListView)
        noPriceAlertText = findViewById(R.id.noPriceAlertText)

        var priceChangeCheck = false

        getPriceAlerts(productId)

        priceAlertCheckbox.setOnCheckedChangeListener { _, isChecked ->
            priceChangeCheck = isChecked
            priceAlertEditText.isEnabled = !isChecked
            priceAlertButton.isEnabled = isChecked || priceAlertEditText.text.toString().isNotEmpty()
        }

        priceAlertEditText.addTextChangedListener(object: TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {
            }

            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                priceAlertButton.isEnabled = !s.isNullOrEmpty()
            }

            override fun afterTextChanged(s: Editable?) {
            }
        })

        priceAlertButton.setOnClickListener {
            if (priceChangeCheck) {
                addPriceAlert(0, 2)
            }
            else {
                val enteredPrice = priceAlertEditText.text.toString().toInt()
                addPriceAlert(enteredPrice, 1)
            }
        }
    }

    private fun addPriceAlert(price: Int, type: Int) {
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)

        apiInterface.createPriceChangeAlert(authToken, productId, type, price).enqueue(object :
                retrofit2.Callback<ResponseBody> {
            override fun onFailure(call: Call<ResponseBody>?, error: Throwable?) {
                Log.i("PriceAlertFailure", "error" + error?.message.toString())
                Toast.makeText(applicationContext, "There was an error, please try again!", Toast.LENGTH_SHORT).show()
            }

            override fun onResponse(call: Call<ResponseBody>?, response: Response<ResponseBody>?) {
                Log.i("PriceAlertResponse", response.toString())
                if (response != null) {
                    if (response.isSuccessful) {
                        Toast.makeText(applicationContext, "Price change alert is created!", Toast.LENGTH_SHORT).show()
                        getPriceAlerts(productId)
                        priceAlertCheckbox.isChecked = false
                        priceAlertEditText.isEnabled = true
                    }
                    else {
                        val errorMessage = response.errorBody()?.string()
                        Log.i("PriceAlertError", errorMessage)
                        if (errorMessage != null) {
                            if (errorMessage.contains("already")) {
                                if (type == 2) {
                                    priceAlertCheckbox.isChecked = false
                                    priceAlertEditText.isEnabled = true
                                    Toast.makeText(applicationContext, "You already have a price change alert!", Toast.LENGTH_LONG).show()
                                }
                                else {
                                    priceAlertCheckbox.isChecked = false
                                    priceAlertEditText.isEnabled = true
                                    Toast.makeText(applicationContext, "You already have a price drop alert! " +
                                            "Please delete the existing alert to create a new one.", Toast.LENGTH_LONG).show()
                                }
                            } else {
                                Toast.makeText(applicationContext, "There was an error, please try again!", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                }
            } // end of onResponse
        }) // end of createPriceDropAlert
    }

    private fun getPriceAlerts(productId: Int) {
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)

        apiInterface.getPriceAlerts(authToken, productId).enqueue(object : retrofit2.Callback<List<PriceAlertResponse>> {
            override fun onFailure(call: Call<List<PriceAlertResponse>>, error: Throwable) {
                Log.i("GetPriceAlertFailure", "error" + error.message.toString())
                Toast.makeText(applicationContext, "There was an error, please try again!", Toast.LENGTH_SHORT).show()
            }

            override fun onResponse(call: Call<List<PriceAlertResponse>>, response: Response<List<PriceAlertResponse>>) {
                Log.i("GetPriceAlertResponse", response.toString())
                if (response.isSuccessful) {
                    priceAlertList = response.body() as ArrayList<PriceAlertResponse>
                    if (priceAlertList.isEmpty()) {
                        priceAlertListView.visibility = ListView.INVISIBLE
                        noPriceAlertText.visibility = TextView.VISIBLE
                    }
                    else {
                        priceAlertListView.visibility = ListView.VISIBLE
                        noPriceAlertText.visibility = TextView.INVISIBLE
                        val priceAlertAdapter = PriceAlertAdapter(applicationContext, priceAlertList, authToken)
                        priceAlertListView.adapter = priceAlertAdapter
                    }
                }
                else {
                    val errorMessage = response.errorBody()?.string()
                    Log.i("GetPriceAlertError", errorMessage)
                    Toast.makeText(applicationContext, "There was an error, please try again!", Toast.LENGTH_SHORT).show()
                }
            }
        })
    }

}

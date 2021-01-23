package com.example.tursuapp.authentication.homepage.ui.order

import android.R.attr.defaultValue
import android.R.attr.key
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.fragment.app.Fragment
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.authentication.homepage.HomePageActivity
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response

// For vendor, choose an estimated date for arrival of the order
class DayEstimatorFragment : Fragment() {
    lateinit var auth_token: String
    var estimatedDayCount = -1
    var cargoID = ""
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {

        val root = inflater.inflate(R.layout.vendor_day_estimator_pop_up, container, false)
        return root
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val bundle = this.arguments
        var orderID = -1
        if (bundle != null) {
            orderID = bundle.getInt("orderID", defaultValue)
        }
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        view.findViewById<Button>(R.id.button_ok).setOnClickListener {
            estimatedDayCount = view.findViewById<EditText>(R.id.estimatedDay).text.toString().toInt()
            cargoID = view.findViewById<EditText>(R.id.cargoIDEditText).text.toString()
            setInDeliveryMode(orderID, cargoID, estimatedDayCount, auth_token)
        }
        view.findViewById<Button>(R.id.button_cancel_order).setOnClickListener {
            activity?.onBackPressed()
        }

    }
    // to put order in delivery status
    fun setInDeliveryMode(orderID: Int, cargoID: String, dayCount: Int, auth_token: String){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.setDelivery(auth_token, orderID, cargoID, dayCount).enqueue(object :
                retrofit2.Callback<ResponseBody> {
            override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<ResponseBody>?,
                    response: Response<ResponseBody>?
            ) {
                if (response != null) {
                    if (response.code() == 200) {
                        Toast.makeText(context, "Your order is in delivery!", Toast.LENGTH_SHORT).show()
                        val fragment = VendorOrderFragment()
                        activity?.supportFragmentManager?.beginTransaction()
                                ?.replace(R.id.nav_host_fragment, fragment)
                                ?.commit()

                    } else {
                        Toast.makeText(context, "Failed!", Toast.LENGTH_SHORT).show()
                    }
                }

            }


        })
    }

}
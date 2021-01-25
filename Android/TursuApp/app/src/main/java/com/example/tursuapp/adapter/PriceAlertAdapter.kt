package com.example.tursuapp.adapter

import android.annotation.SuppressLint
import android.content.Context
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.PriceAlertResponse
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response

class PriceAlertAdapter(context: Context,
                        private var priceAlertList: ArrayList<PriceAlertResponse>,
                        private val authToken: String) : BaseAdapter() {
    var context: Context? = context

    override fun getCount(): Int {
        return priceAlertList.size
    }

    override fun getItem(position: Int): Any {
        return priceAlertList[position]
    }

    override fun getItemId(position: Int): Long {
        return position.toLong()
    }

    @SuppressLint("ViewHolder", "InflateParams")
    override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
        val inflater = this.context?.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val priceAlertView = inflater.inflate(R.layout.price_alert_layout, null)
        val alertId = priceAlertList[position].alertId
        val alertType = priceAlertList[position].alertType
        val alertValue = priceAlertList[position].alertValue
        if (alertType == 2) {
            priceAlertView.findViewById<TextView>(R.id.priceAlertText).text = "You will be notified when this product's price changes!"
        }
        else {
            val stringFormat = "You will be notified when this product's price drops below %d TL."
            priceAlertView.findViewById<TextView>(R.id.priceAlertText).text = String.format(stringFormat, alertValue)
        }

        priceAlertView.findViewById<ImageButton>(R.id.deletePriceAlertButton).setOnClickListener {
            deletePriceAlert(alertId, position)
        }

        return priceAlertView
    }

    private fun deletePriceAlert(alertId: Int, position: Int) {
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)

        apiInterface.deletePriceChangeAlert(authToken, alertId).enqueue(object :
            retrofit2.Callback<ResponseBody> {
            override fun onResponse(call: Call<ResponseBody>, response: Response<ResponseBody>) {
                Log.i("DeleteAlertResponse", response.toString())
                if (response.isSuccessful) {
                    Log.i("position", position.toString())
                    priceAlertList.removeAt(position)
                    notifyDataSetChanged()
                    Toast.makeText(context, "The alert has been removed successfully!", Toast.LENGTH_SHORT).show()
                }
                else {
                    val errorMessage = response.errorBody()?.string()
                    Log.i("DeleteAlertError", errorMessage)
                    Toast.makeText(context, "There was an error, please try again!", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<ResponseBody>, t: Throwable) {
                Log.i("DeleteAlertFailure", "error" + t.message.toString())
                Toast.makeText(context, "There was an error, please try again!", Toast.LENGTH_SHORT).show()
            }

        })
    }
}
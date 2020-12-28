package com.example.tursuapp.authentication.homepage.ui.order

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ListView
import androidx.fragment.app.Fragment
import com.example.tursuapp.R
import com.example.tursuapp.adapter.VendorOrderAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.VendorDataResponse
import com.example.tursuapp.api.responses.VendorOrderLists
import com.example.tursuapp.api.responses.VendorProductLists
import retrofit2.Call
import retrofit2.Response


class VendorOrderFragment : Fragment() {

    private lateinit var productPageViewModel: VendorOrderViewModel
    lateinit var auth_token:String
    var orders = listOf<VendorOrderLists>()
    var products = listOf<VendorProductLists>()
    var ordersDictionary = mutableMapOf<VendorOrderLists, VendorProductLists>()
    lateinit var listView:ListView
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {

        val root = inflater.inflate(R.layout.fragment_vendor_give_order, container, false)
        return root
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        listView = view.findViewById(R.id.vendor_order_list_view)
        getVendorOrders()
    }


    fun getVendorOrders(){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getProductsOfVendor(auth_token).enqueue(object :
                retrofit2.Callback<VendorDataResponse> {
            override fun onFailure(p0: Call<VendorDataResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<VendorDataResponse>?,
                    response: Response<VendorDataResponse>?
            ) {
                if (response != null) {
                    orders = response.body()?.orders!!
                    products = response.body()!!.products
                    createOrderProductDict()
                    val adapter = VendorOrderAdapter(context!!, ordersDictionary.keys.toList(), ordersDictionary.values.toList(),auth_token)
                    listView.adapter = adapter


                }

            }


        })
    }

    fun getOrderDetail(order:VendorOrderLists):HashMap<String,String>{
        val orderDetail = HashMap<String,String>()
        val tempOrder = order
        val tempProd = ordersDictionary[order]
        orderDetail["orderID"] = tempOrder.id.toString()
        orderDetail["customer"] = tempOrder.customer
        orderDetail["productID"] = tempOrder.product.toString()
        orderDetail["status"] = tempOrder.status
        orderDetail["cargoID"] = tempOrder.cargoID
        orderDetail["orderDate"] = tempOrder.orderDate
        orderDetail["estimatedArrivalDate"] = tempOrder.estimatedArrivalDate
        orderDetail["arrivalDate"] = tempOrder.arrivalDate
        orderDetail["quantity"] = tempOrder.quantity.toString()
        orderDetail["comment"] = tempOrder.comment
        return orderDetail
    }
    fun createOrderProductDict(){
        for(order in orders){
            for(product in products){
                if(order.product == product.id){
                    ordersDictionary[order] = product
                }
            }
        }
    }
}
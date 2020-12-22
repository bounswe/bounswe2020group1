package com.example.tursuapp.authentication.homepage.ui.order

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ArrayAdapter
import android.widget.ListView
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.adapter.OrderAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.CustomerOrderResponse
import retrofit2.Call
import retrofit2.Response


data class CustomerOrder(val price: String, val quantity: Int, val status: String)

class CustomerOrdersFragment : Fragment() {

    private lateinit var customerOrderPageViewModel: CustomerOrdersViewModel
    private var orderList: MutableList<CustomerOrder> = mutableListOf()
    private lateinit var orderListView: ListView
    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        customerOrderPageViewModel = ViewModelProvider(this).get(CustomerOrdersViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_customer_orders, container, false)
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val auth_token = "Token 3f4f61f58fec5cd1e984d84a2ce003875fa771f9"
        orderListView = view.findViewById(R.id.customerOrderListView)
        getOrdersOfCustomer(auth_token, view)

    }
    fun getOrdersOfCustomer(auth_token: String, view: View){
        val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiinterface.getOrdersOfCustomer(auth_token).enqueue(object :
                retrofit2.Callback<List<List<CustomerOrderResponse>>> {
            override fun onFailure(p0: Call<List<List<CustomerOrderResponse>>>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<List<CustomerOrderResponse>>>?,
                    response: Response<List<List<CustomerOrderResponse>>>?
            ) {
                if (response != null) {
                    response.body()?.let { createCustomerOrders(it) }
                    val adapter = OrderAdapter(context!!, orderList)
                    orderListView.adapter = adapter

                }

            }


        })
    }
    fun createCustomerOrders(orderResponses: List<List<CustomerOrderResponse>>){
        for(tempOrderList in orderResponses){
            var price = 0.0
            var quantity = 0
            val statusSet = mutableSetOf<String>()
            lateinit var newOrder :CustomerOrder
            for(order in tempOrderList){
                price+=order.product.price.toDouble()
                quantity+=order.quantity
                statusSet.add(order.status)
            }
            var status = ""
            for(temp in statusSet){
                status+=temp+","
            }
            status.dropLast(1)
            newOrder = CustomerOrder(price.toString(), quantity, status)
            orderList.add(newOrder)
        }
    }

}
package com.example.tursuapp.authentication.homepage.ui.order

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.adapter.OrderAdapter
import com.example.tursuapp.adapter.VendorAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.CustomerOrderResponse
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.account.AccountFragment
import com.example.tursuapp.authentication.homepage.ui.profile.ProfileFragment
import com.squareup.picasso.Picasso
import okhttp3.ResponseBody
import org.w3c.dom.Text
import retrofit2.Call
import retrofit2.Response


data class CustomerOrder(val price: String, val quantity: Int, val status: String)
data class Product(val name:String,val vendorName:String,val photoUrl:String,val quantity:Int,val status:String,val estimatedArrivalDate:String,val productID:Int)
class CustomerOrdersFragment : Fragment() {

    val auth_token = "Token 3f4f61f58fec5cd1e984d84a2ce003875fa771f9"
    private lateinit var backArrow:ImageView
    private lateinit var customerOrderPageViewModel: CustomerOrdersViewModel
    private var orderList: MutableList<CustomerOrder> = mutableListOf()
    private var orderResponsesList: List<List<CustomerOrderResponse>> = mutableListOf()
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

        orderListView = view.findViewById(R.id.customerOrderListView)
        backArrow = view.findViewById(R.id.back_arrow2)
        backArrow.setOnClickListener {
            displayFragment(R.id.nav_account)
        }
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
                    orderListView.setOnItemClickListener { parent, view, position, id ->
                        val productOfOrdersList = getOrders(position)
                        val adapter = ProductOrderAdapter(context!!, productOfOrdersList)
                        orderListView.adapter = adapter
                        adapter.notifyDataSetChanged()
                        backArrow.setOnClickListener {
                            displayFragment(R.id.nav_customer_orders)
                        }

                    }

                }

            }


        })
    }
    private fun displayFragment(id:Int){
        lateinit var fragment: Fragment
        if(id == R.id.nav_account){
            fragment = AccountFragment()
        }
        else if(id == R.id.nav_customer_orders){
            fragment = CustomerOrdersFragment()
        }
        activity?.supportFragmentManager?.beginTransaction()
                ?.replace(R.id.nav_host_fragment, fragment)
                ?.commit()
        (activity as HomePageActivity).drawer.closeDrawer(GravityCompat.START)
    }
    //Product(val name:String,val vendorName:String,val photoUrl:String,val quantity:Int,val status:String,val estimatedArrivalDate:String)
    fun getOrders(position: Int):List<Product>{
        var productList = mutableListOf<Product>()

        for(product in orderResponsesList[position]){
            val newProduct = Product(product.product.name,
                    product.product.vendor_name,
                    product.product.photo_url,
                    product.quantity,
                    product.status,
                    product.estimatedArrivalDate,
                    product.id
            )
            productList.add(newProduct)
        }

        return productList
    }
    fun createCustomerOrders(orderResponses: List<List<CustomerOrderResponse>>){
        orderResponsesList = orderResponses
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
    class ProductOrderAdapter(context: Context, private var productList: List<Product>) : BaseAdapter() {
        val auth_token = "Token 3f4f61f58fec5cd1e984d84a2ce003875fa771f9"

        var context: Context? = context

        override fun getCount(): Int {
            return productList.size
        }

        override fun getItem(position: Int): Any {
            return productList[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        @SuppressLint("SetTextI18n", "ViewHolder", "InflateParams")
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            //val food = this.productList[position]

            val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            val productView = inflator.inflate(R.layout.product_order_layout, null)
            val cancelOrderButton = productView.findViewById<TextView>(R.id.cancel_order_button)
            val setDeliveredButton = productView.findViewById<TextView>(R.id.set_delivered_button)
            if(productList[position].status=="in delivery"){
                cancelOrderButton.visibility = View.INVISIBLE
                setDeliveredButton.visibility = View.VISIBLE
                setDeliveredButton.setOnClickListener {
                    setDelivered(productView,productList[position].productID,auth_token)
                    setDeliveredButton.visibility = View.INVISIBLE
                }
            }
            else if(productList[position].status=="processing"){
                cancelOrderButton.visibility = View.VISIBLE
                setDeliveredButton.visibility = View.INVISIBLE
                cancelOrderButton.setOnClickListener {
                    cancelOrder(productView,productList[position].productID,auth_token)
                    cancelOrderButton.visibility = View.INVISIBLE
                }
            }
            else{
                cancelOrderButton.visibility = View.INVISIBLE
                setDeliveredButton.visibility = View.INVISIBLE
            }
            productView.findViewById<TextView>(R.id.order_product_id).text = productList[position].productID.toString()
            productView.findViewById<TextView>(R.id.order_product_name).text = productList[position].name
            productView.findViewById<TextView>(R.id.order_product_quantity).text = productList[position].quantity.toString()
            productView.findViewById<TextView>(R.id.order_product_status).text = productList[position].status
            val image  = productView.findViewById<ImageView>(R.id.order_product_photo_url)
            if(productList[position].photoUrl!="") {
                Picasso
                        .get() // give it the context
                        .load(productList[position].photoUrl) // load the image
                        .into(image)
            }
            else{
                image.setImageResource(R.drawable.ic_menu_camera)
            }
            //foodView.findViewById<ImageView>(R.id.img_product).setImageResource(R.drawable.tursu_logo)
            return productView
        }
        fun cancelOrder(view:View,orderID:Int,auth_token: String){
            val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiinterface.cancelOrder(auth_token,orderID).enqueue(object :
                retrofit2.Callback<ResponseBody> {
                override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                    p0: Call<ResponseBody>?,
                    response: Response<ResponseBody>?
                ) {
                    if (response != null) {
                        if(response.code()==200){
                            Log.i("CalcelOrder","order cancelled")
                            view.findViewById<TextView>(R.id.order_product_status).text = "cancelled"
                        }
                        else{
                            Log.i("CalcelOrder","order cancelled")
                        }
                    }

                }


            })
        }
        fun setDelivered(view:View,orderID:Int,auth_token: String){
            val apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiinterface.orderSetDelivered(auth_token,orderID).enqueue(object :
                retrofit2.Callback<ResponseBody> {
                override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                    Log.i("MainFragment", "error" + p1?.message.toString())
                }

                override fun onResponse(
                    p0: Call<ResponseBody>?,
                    response: Response<ResponseBody>?
                ) {
                    if (response != null) {
                        if(response.code()==200){
                            view.findViewById<TextView>(R.id.order_product_status).text = "delivered"
                            Log.i("CalcelOrder","order cancelled")
                        }
                        else{
                            Log.i("CalcelOrder","order cancelled")
                        }
                    }

                }


            })
        }
    }
}
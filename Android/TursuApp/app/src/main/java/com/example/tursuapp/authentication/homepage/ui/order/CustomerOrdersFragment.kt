package com.example.tursuapp.authentication.homepage.ui.order

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
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
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.example.tursuapp.authentication.homepage.ui.profile.ProfileFragment
import com.squareup.picasso.Picasso
import okhttp3.ResponseBody
import org.w3c.dom.Text
import retrofit2.Call
import retrofit2.Response


data class CustomerOrder(val price: String, val quantity: Int, val status: String)
data class Product(val id:Int,val name:String,val vendorName:String,val photoUrl:String,val quantity:Int,val status:String,val estimatedArrivalDate:String,val productID:Int)
class CustomerOrdersFragment : Fragment() {

    lateinit var auth_token :String
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
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token",null).toString()
        val root = inflater.inflate(R.layout.fragment_customer_orders, container, false)
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        orderListView = view.findViewById(R.id.customerOrderListView)
        backArrow = view.findViewById(R.id.back_arrow2)
        backArrow.setOnClickListener {
            (activity as HomePageActivity).displayFragment(R.id.nav_home,0,"",null)
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
                        val adapter = ProductOrderAdapter(context!!, productOfOrdersList,auth_token)
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
            (activity as HomePageActivity).displayFragment(R.id.nav_home,0,"",null)

        }
        else if(id == R.id.nav_customer_orders){
            fragment = CustomerOrdersFragment()
            activity?.supportFragmentManager?.beginTransaction()
                    ?.replace(R.id.nav_host_fragment, fragment)
                    ?.commit()
            (activity as HomePageActivity).drawer.closeDrawer(GravityCompat.START)
        }

    }
    //Product(val name:String,val vendorName:String,val photoUrl:String,val quantity:Int,val status:String,val estimatedArrivalDate:String)
    fun getOrders(position: Int):List<Product>{
        var productList = mutableListOf<Product>()

        for(product in orderResponsesList[position]){
            val newProduct = Product(product.product.id,
                    product.product.name,
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
    class ProductOrderAdapter(context: Context, private var productList: List<Product>,
                              val auth_token: String
    ) : BaseAdapter() {
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
            val addCommentCView = productView.findViewById<CardView>(R.id.cardView_addComment)
            val addCommentImage = productView.findViewById<ImageView>(R.id.o_add_comment_image)
            if(productList[position].status=="in delivery"){
                cancelOrderButton.visibility = View.INVISIBLE
                setDeliveredButton.visibility = View.VISIBLE
                setDeliveredButton.setOnClickListener {
                    setDelivered(productView,productList[position].productID,auth_token)
                    setDeliveredButton.visibility = View.INVISIBLE
                    addCommentCView.visibility=View.VISIBLE
                }
                addCommentImage.setOnClickListener {
                    ShowAddCommentPopup(productView,productList[position].id,productList[position].name,productList[position].photoUrl,auth_token)
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
            else if(productList[position].status=="delivered"){
                addCommentCView.visibility=View.VISIBLE
                cancelOrderButton.visibility = View.INVISIBLE
                setDeliveredButton.visibility = View.INVISIBLE
                addCommentImage.setOnClickListener {
                    ShowAddCommentPopup(productView,productList[position].id,productList[position].name,productList[position].photoUrl,auth_token)
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
        @SuppressLint("InflateParams")
        private fun ShowAddCommentPopup(view:View,orderID:Int,name: String,photoUrl: String,auth_token: String) {
            //Create a View object yourself through inflater
            val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            val popupView: View = inflater.inflate(R.layout.comment_add_popup_layout, null)
            //Specify the length and width through constants
            val width = LinearLayout.LayoutParams.MATCH_PARENT
            val height = LinearLayout.LayoutParams.MATCH_PARENT
            //val width = LinearLayout.LayoutParams.WRAP_CONTENT
            //val height = LinearLayout.LayoutParams.WRAP_CONTENT
            //Make Inactive Items Outside Of PopupWindow
            val focusable = true
            //Create a window with our parameters
            val popupWindow = PopupWindow(popupView, width, height, focusable)
            //Set the location of the window on the screen
            popupWindow.showAtLocation(view, Gravity.CENTER, 0, 0)
            //load product name and photo to the popup
            popupView.findViewById<TextView>(R.id.addComment_product_name).text=name
            val image  = popupView.findViewById<ImageView>(R.id.addComment_productImage)
            if(photoUrl!="") {
                Picasso
                        .get() // give it the context
                        .load(photoUrl) // load the image
                        .into(image)
            }
            else{
                image.setImageResource(R.drawable.ic_menu_camera)
            }

            popupView.findViewById<ImageView>(R.id.addComment_cancel_btn).setOnClickListener {
                popupWindow.dismiss()
            }
            popupView.findViewById<Button>(R.id.addComment_button).setOnClickListener {
                Log.i("orderID: ", orderID.toString())
                if(popupView.findViewById<TextView>(R.id.addComment_text).text.isEmpty() || popupView.findViewById<RatingBar>(R.id.addComment_ratingBar).rating == 0.0f){
                    Toast.makeText(context, "Please input your comment and rating", Toast.LENGTH_SHORT).show()
                }else {
                    val commentRating = popupView.findViewById<RatingBar>(R.id.addComment_ratingBar).rating
                    val commentText = popupView.findViewById<TextView>(R.id.addComment_text).text
                    val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
                    apiInterface.addComment(auth_token, orderID, commentText.toString(), commentRating.toInt()).enqueue(object :
                            retrofit2.Callback<ResponseBody> {
                        override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                            Log.i("MainFragment", "error" + p1?.message.toString())
                        }

                        override fun onResponse(
                                p0: Call<ResponseBody>?,
                                response: Response<ResponseBody>?
                        ) {

                            if (response != null) {
                                Log.i("Status code", response.code().toString())
                                if (response.code() == 200) {
                                    Toast.makeText(context, "Comment has been successfully added", Toast.LENGTH_SHORT).show()
                                    popupWindow.dismiss()

                                } else if (response.code() == 401) {
                                    Toast.makeText(context, "The customer did not buy the product.", Toast.LENGTH_SHORT).show()

                                } else {
                                    Toast.makeText(context, response.code(), Toast.LENGTH_SHORT).show()
                                }

                            }

                        }


                    })
                }
            }

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
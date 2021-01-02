package com.example.tursuapp.authentication.homepage.ui.productpage

import android.annotation.SuppressLint
import android.content.Context
import android.os.Bundle
import android.provider.DocumentsContract
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.adapter.CommentAdapter
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.Comments
import com.example.tursuapp.api.responses.ProductDetailsResponse
import com.example.tursuapp.api.responses.ProductResponse
import com.squareup.picasso.Picasso
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response

class ProductPageFragment : Fragment() {

    private lateinit var productPageViewModel: ProductPageModel
    private lateinit var product: ProductDetailsResponse
    lateinit var auth_token :String
    lateinit var user_type :String
    var commentList = ArrayList<Comments>()
    private lateinit var commentListView: ListView
    var allLists = listOf<String>()

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        user_type = pref?.getString("user_type", null).toString()
        activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
        activity?.findViewById<EditText>(R.id.editMobileNo)!!.visibility = View.INVISIBLE
        activity?.findViewById<Button>(R.id.search_button)!!.visibility = View.INVISIBLE
        productPageViewModel = ViewModelProvider(this).get(ProductPageModel::class.java)
        val root = inflater.inflate(R.layout.fragment_productpage, container, false)
        root.findViewById<ImageView>(R.id.add_list_image)?.setOnClickListener {
            showPopupWindow(it)
        }
        root.findViewById<ImageView>(R.id.add_comment_image)?.setOnClickListener {
            showPopupAddComment(it)
        }

        return root
    }
    fun setVisibilities(view: View){
        val addToCart = view.findViewById<CardView>(R.id.addCart)
        val addToList = view.findViewById<CardView>(R.id.cardView3)
        val addComment = view.findViewById<CardView>(R.id.cardView4)
        if(user_type=="customer"){
            addToCart.visibility = View.VISIBLE
            addToList.visibility = View.VISIBLE
            addComment.visibility = View.VISIBLE
        }
        else{
            addToCart.visibility = View.INVISIBLE
            addToList.visibility = View.INVISIBLE
            addComment.visibility = View.INVISIBLE
        }
    }
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val id_str = requireArguments().getString("id")
        setVisibilities(view)
        getDetails(id_str!!.toInt(), view)
        view.findViewById<CardView>(R.id.addCart).setOnClickListener(){
            var apiinterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            val quantity = 1
            apiinterface.addToShoppingCart(auth_token, product.id).enqueue(object :
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
                            Toast.makeText(context, "added to shopping cart", Toast.LENGTH_SHORT).show()
                        } else {
                            Toast.makeText(context, "NOT added to shopping cart", Toast.LENGTH_SHORT).show()
                        }
                    }

                }


            })
        }


    }

    @SuppressLint("InflateParams")
    private fun showPopupWindow(view: View) {
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.lists_popup_layout, null)
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
        getLists(popupView)
        popupView.findViewById<ImageView>(R.id.dismiss_popup2).setOnClickListener {
            popupWindow.dismiss()
        }
        popupView.findViewById<Button>(R.id.add_new_List_button).setOnClickListener {
            addList(popupView, popupWindow)
        }
        popupView.findViewById<Button>(R.id.add_product_to_list).setOnClickListener {
            addToList(popupView, popupWindow)
        }
        popupView.findViewById<Button>(R.id.delete_List_button).setOnClickListener {
            deleteList(popupView, popupWindow)
        }
        popupView.findViewById<Button>(R.id.delete_product_from_list).setOnClickListener {
            deleteFromList(popupView, popupWindow)

        }
    }

    @SuppressLint("InflateParams")
    private fun showPopupAddComment(view: View) {
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
        popupView.findViewById<TextView>(R.id.addComment_product_name).text=product.name
        val image  = popupView.findViewById<ImageView>(R.id.addComment_productImage)
        if(product.photo_url!="") {
            Picasso
                    .get() // give it the context
                    .load(product.photo_url) // load the image
                    .into(image)
        }
        else{
            image.setImageResource(R.drawable.ic_menu_camera)
        }

        popupView.findViewById<ImageView>(R.id.addComment_cancel_btn).setOnClickListener {
            popupWindow.dismiss()
        }
        popupView.findViewById<Button>(R.id.addComment_button).setOnClickListener {
            addComment(view,popupView, popupWindow)
        }

    }
    private fun getLists(view: View){
            val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getLists(auth_token).enqueue(object :
                retrofit2.Callback<List<String>> {
            override fun onFailure(p0: Call<List<String>>?, p1: Throwable?) {
                //Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<List<String>>?,
                    response: Response<List<String>>?
            ) {
                if (response != null) {
                    Log.i("Status code", response.code().toString())
                    allLists = response.body()!!
                    val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupLists)
                    for (list in allLists) {
                        Log.i("List:", list)
                        val btn1 = RadioButton(activity?.applicationContext)
                        btn1.text = list
                        radioGroup.addView(btn1)
                    }


                }


            }

        })

    }
    private fun addComment(root:View,view: View, window: PopupWindow){
        if(view.findViewById<TextView>(R.id.addComment_text).text.isEmpty() || view.findViewById<RatingBar>(R.id.addComment_ratingBar).rating == 0.0f){
            Toast.makeText(context, "Please input your comment and rating", Toast.LENGTH_SHORT).show()
        }else {
            val commentRating = view.findViewById<RatingBar>(R.id.addComment_ratingBar).rating
            val commentText = view.findViewById<TextView>(R.id.addComment_text).text
            val productId = product.id
            Log.i("Product Id: ", productId.toString())
            val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.addComment(auth_token, productId, commentText.toString(), commentRating.toInt()).enqueue(object :
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
                            window.dismiss()

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
    private fun addList(view: View, window: PopupWindow){
        if(view.findViewById<EditText>(R.id.new_list_txt).text.isNotEmpty()){
            val empty=""
            val listName = view.findViewById<EditText>(R.id.new_list_txt).text.toString()
            val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.addList(auth_token, listName).enqueue(object :
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
                            Toast.makeText(context, "List has been successfully added", Toast.LENGTH_SHORT).show()
                            window.dismiss()
                            showPopupWindow(view)
                        } else {
                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                        }

                    }

                }


            })

        }else{
            Toast.makeText(context, "Please input a list name", Toast.LENGTH_SHORT).show()
        }
    }
    private fun addToList(view: View, window: PopupWindow){
        if(view.findViewById<RadioGroup>(R.id.radioGroupLists).checkedRadioButtonId!=-1) {
            val selectedList = view.findViewById<RadioGroup>(R.id.radioGroupLists).checkedRadioButtonId
            Log.i("Selected List Id: ", selectedList.toString())
            val newRadioButton = view.findViewById<RadioButton>(selectedList)
            Log.i("Selected List Name: ", newRadioButton.text.toString())
            val listName = newRadioButton.text.toString()
            val productId = product.id
            Log.i("Product Id: ", productId.toString())

            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.addToList(auth_token, listName, productId).enqueue(object :
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
                            Toast.makeText(context, "Product has been successfully added to list", Toast.LENGTH_SHORT).show()
                            //showPopupWindow(view)
                            window.dismiss()
                            // AddListStatus = response.body()!!
                            //view.findViewById<EditText>(R.id.new_list_txt).setText("")
                        } else {
                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                        }

                    }

                }


            })
        }else{
            Toast.makeText(context, "Select a list name", Toast.LENGTH_SHORT).show()
        }
    }

    private fun deleteList(view: View, window: PopupWindow){
        if(view.findViewById<RadioGroup>(R.id.radioGroupLists).checkedRadioButtonId!=-1) {
            val selectedList = view.findViewById<RadioGroup>(R.id.radioGroupLists).checkedRadioButtonId
            Log.i("Selected List Id: ", selectedList.toString())
            val newRadioButton = view.findViewById<RadioButton>(selectedList)
            Log.i("Selected List Name: ", newRadioButton.text.toString())
            val listName = newRadioButton.text.toString()
            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.deleteList(auth_token, listName).enqueue(object :
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
                            Toast.makeText(context, "List has been successfully deleted", Toast.LENGTH_SHORT).show()
                            window.dismiss()
                            showPopupWindow(view)
                        } else {
                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                        }

                    }

                }

            })
        }else{
            Toast.makeText(context, "Select a list name", Toast.LENGTH_SHORT).show()
        }

    }

    private fun deleteFromList(view: View, window: PopupWindow){
        if(view.findViewById<RadioGroup>(R.id.radioGroupLists).checkedRadioButtonId!=-1) {
            val selectedList = view.findViewById<RadioGroup>(R.id.radioGroupLists).checkedRadioButtonId
            Log.i("Selected List Id: ", selectedList.toString())
            val newRadioButton = view.findViewById<RadioButton>(selectedList)
            Log.i("Selected List Name: ", newRadioButton.text.toString())
            val listName = newRadioButton.text.toString()
            val productId = product.id
            Log.i("Product Id: ", productId.toString())

            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.deleteFromList(auth_token, listName, productId).enqueue(object :
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
                            Toast.makeText(context, "Product has been successfully deleted from list", Toast.LENGTH_SHORT).show()
                            window.dismiss()
                        } else {
                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                        }

                    }

                }


            })
        } else{
                Toast.makeText(context, "Select a list name", Toast.LENGTH_SHORT).show()
            }
    }

    private fun getDetails(id: Int, view: View){
        val apiInterface : ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getProductDetails(id).enqueue(object :
                retrofit2.Callback<ProductDetailsResponse> {
            override fun onFailure(p0: Call<ProductDetailsResponse>?, p1: Throwable?) {
                Log.i("MainFragment", "error" + p1?.message.toString())
            }

            override fun onResponse(
                    p0: Call<ProductDetailsResponse>?,
                    response: Response<ProductDetailsResponse>?
            ) {
                if (response != null) {
                    Log.i("MainFragment", "inside onResponse")
                    product = response.body()!!
                    displayProductInfo(view)
                    commentList = ArrayList(product.comments)
                    val adapter = context?.let { CommentAdapter(it, commentList) }
                    commentListView = view.findViewById(R.id.commentListView)
                    displayProductInfo(view)
                    if (commentListView != null) {
                        commentListView.adapter = adapter

                        /*
                            commentListView.setOnItemClickListener { _, view, _, _ ->
                                val clickedId = view.findViewById<TextView>(R.id.product_id).text
                                val bundle = Bundle()
                                bundle.putString("id", clickedId.toString())
                                val newFragment = VendorProductPageFragment()
                                newFragment.arguments = bundle
                                val fragmentManager: FragmentManager? = fragmentManager
                                val fragmentTransaction: FragmentTransaction =
                                        fragmentManager!!.beginTransaction()
                                fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
                                fragmentTransaction.commit()
                            }*/
                        // }
                    } else {
                        Log.i("Customer Comments: ", "have not any comment")
                        // Toast.makeText(context, "have not any comment", Toast.LENGTH_SHORT).show()
                    }

                }

            }


        })
    }

    fun displayProductInfo(view: View){
        view.findViewById<TextView>(R.id.product_name).text = product.name
        view.findViewById<TextView>(R.id.product_description).text = product.description
        view.findViewById<RatingBar>(R.id.ratingBar).rating = product.rating.toFloat()
        view.findViewById<TextView>(R.id.price).text = product.price+" TL"
        view.findViewById<TextView>(R.id.vendor).text = "Vendor: "+product.vendor_name
        view.findViewById<TextView>(R.id.brand).text = "Brand: "+product.brand

        val image  = view.findViewById<ImageView>(R.id.productImage)
        if(product.photo_url!="") {
            Picasso
                .get() // give it the context
                .load(product.photo_url) // load the image
                .into(image)
        }
        else{
            image.setImageResource(R.drawable.ic_menu_camera)
        }
    }
    class ProductAdapter : BaseAdapter {
        var productList = ArrayList<ProductResponse>()
        var productImages = ArrayList<ImageView>()
        var context: Context? = null

        constructor(context: Context, productList: ArrayList<ProductResponse>) : super() {
            this.context = context
            this.productList = productList
        }

        override fun getCount(): Int {
            return productList.size
        }

        override fun getItem(position: Int): Any {
            return productList[position]
        }

        override fun getItemId(position: Int): Long {
            return position.toLong()
        }

        @SuppressLint("SetTextI18n")
        override fun getView(position: Int, convertView: View?, parent: ViewGroup?): View {
            //val food = this.productList[position]

            val inflator = context!!.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
            val productView = inflator.inflate(R.layout.product_for_shopping_cart, null)
            //foodView.findViewById<ImageView>(R.id.img_product).setImageResource(R.drawable.tursu_logo)
            productView.findViewById<TextView>(R.id.product_id).text = this.productList[position].id.toString()
            productView.findViewById<TextView>(R.id.price_product).text = this.productList[position].price + " TL"
            productView.findViewById<TextView>(R.id.text_product).text = this.productList[position].name
            val image  = productView.findViewById<ImageView>(R.id.img_product)
            Picasso
                    .get() // give it the context
                    .load(productList[position].photo_url) // load the image
                    .into(image)
            //val url = URL(productList[position].photo_url)
            //val bmp = BitmapFactory.decodeStream(url.openConnection().getInputStream())
            //productView.findViewById<ImageView>(R.id.img_product).setImageBitmap(bmp)
            return productView
        }
    }
}
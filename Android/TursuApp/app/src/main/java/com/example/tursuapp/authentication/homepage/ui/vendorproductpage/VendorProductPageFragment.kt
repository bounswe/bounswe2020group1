package com.example.tursuapp.authentication.homepage.ui.vendorproductpage

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.DialogInterface
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.DocumentsContract
import android.provider.MediaStore
import android.util.Log
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.appcompat.app.AppCompatActivity
import androidx.cardview.widget.CardView
import androidx.core.content.ContextCompat
import androidx.core.view.GravityCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import com.example.tursuapp.R
import com.example.tursuapp.adapter.CommentAdapter
import com.example.tursuapp.adapter.VendorProductAdapter
import com.example.tursuapp.api.ApiEndpoints
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.api.responses.*
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.example.tursuapp.authentication.homepage.ui.order.CustomerOrdersFragment
import com.example.tursuapp.authentication.homepage.ui.product.ProductAddFragment
import com.example.tursuapp.authentication.homepage.ui.productpage.ProductPageFragment
import com.example.tursuapp.authentication.homepage.ui.profile.ProfileFragment
import com.squareup.picasso.Picasso
import com.example.tursuapp.authentication.homepage.ui.vendorproductpage.VendorProductPageModel
import com.google.gson.GsonBuilder
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.File


class VendorProductPageFragment : Fragment() {

    private lateinit var productPageViewModel: VendorProductPageModel
    private lateinit var product: ProductDetailsResponse
    var vendorProductList = ArrayList<VendorProductLists>()
    var commentList = ArrayList<Comments>()
    private lateinit var commentListView: ListView
    private lateinit var reviewsText:TextView
    private lateinit var noReviewsText:TextView
    private lateinit var auth_token:String
    private var image_uri : Uri? = Uri.EMPTY
    private lateinit var image_view : ImageView
    private var MEDIA_TYPE_TEXT = "text/plain".toMediaTypeOrNull()
    private var MEDIA_TYPE_IMAGE = "image/*".toMediaTypeOrNull()
    private var MEDIA_TYPE_PHOTO = "photo"

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {
        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token",null).toString()
        activity?.findViewById<ImageView>(R.id.filter_image)!!.visibility = View.INVISIBLE
        activity?.findViewById<EditText>(R.id.editMobileNo)!!.visibility = View.INVISIBLE
        activity?.findViewById<Button>(R.id.search_button)!!.visibility = View.INVISIBLE
        productPageViewModel = ViewModelProvider(this).get(VendorProductPageModel::class.java)
        val root = inflater.inflate(R.layout.fragment_vendorproductpage, container, false)
        root.findViewById<ImageView>(R.id.update_product_img)?.setOnClickListener {
            //open popup with product data and update the product
            showPopupWindow(it)

        }
        root.findViewById<ImageView>(R.id.delete_product_img)?.setOnClickListener {
            //Do delete operation
            // Build AlertDialog
            val dialogBuilder = AlertDialog.Builder(root.context)

            // set message of alert dialog
            dialogBuilder.setMessage("Do you want to delete the product?")
                    // if the dialog is cancelable
                    .setCancelable(false)
                    // positive button text and action
                    .setPositiveButton("Proceed", DialogInterface.OnClickListener { dialog, id ->
                        deleteProduct(it)
                    })
                    // negative button text and action
                    .setNegativeButton("Cancel", DialogInterface.OnClickListener { dialog, id ->
                        dialog.cancel()
                    })

            // create dialog box
            val alert = dialogBuilder.create()
            // set title for alert dialog box
            alert.setTitle("Delete Product")
            // show alert dialog
            alert.show()
            //


        }
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val id_str = requireArguments().getString("id")
        getDetails(id_str!!.toInt(), view)
    }

    @SuppressLint("InflateParams")
    private fun showPopupWindow(view: View) {
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(AppCompatActivity.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.update_product_popup_layout, null)
        //Specify the length and width through constants
        val width = LinearLayout.LayoutParams.MATCH_PARENT
        val height = LinearLayout.LayoutParams.MATCH_PARENT
        //val width = LinearLayout.LayoutParams.WRAP_CONTENT
        //val height = LinearLayout.LayoutParams.WRAP_CONTENT
        //Make Inactive Items Outside Of PopupWindow
        val focusable = true
        //Create a window with our parameters
        val popupWindow = PopupWindow(popupView, width, height, focusable)
        //displaying product details
        var pickImage = popupView.findViewById(R.id.product_pick_image) as Button
        image_view = popupView.findViewById(R.id.product_image_view) as ImageView

        popupView.findViewById<TextView>(R.id.product_category).text = product.category
        popupView.findViewById<TextView>(R.id.product_name).text = product.name
        popupView.findViewById<TextView>(R.id.product_description).text = product.description
        popupView.findViewById<TextView>(R.id.product_brand).text = product.brand
        popupView.findViewById<TextView>(R.id.product_stock).text = product.stock.toString()
        popupView.findViewById<TextView>(R.id.product_price).text = product.price

        val image  = popupView.findViewById<ImageView>(R.id.product_image_view)
        if(product.photo_url!="") {
            Picasso
                    .get() // give it the context
                    .load(product.photo_url) // load the image
                    .resize(800, 1000)
                    .onlyScaleDown()
                    .into(image)
        }
        else{
            image.setImageResource(R.drawable.ic_menu_camera)
        }
        //Set the location of the window on the screen
        popupWindow.showAtLocation(view, Gravity.CENTER, 0, 0)

        pickImage.setOnClickListener(pickImageListener)
        popupView.findViewById<ImageView>(R.id.dismiss_pop_up).setOnClickListener {
            popupWindow.dismiss()
            val clickedId = product.id
            val bundle = Bundle()
            bundle.putString("id", clickedId.toString())
            val newFragment = VendorProductPageFragment()
            newFragment.arguments = bundle
            val fragmentManager: FragmentManager? = fragmentManager
            val fragmentTransaction: FragmentTransaction =
                    fragmentManager!!.beginTransaction()
            fragmentTransaction.replace(R.id.nav_host_fragment, newFragment).addToBackStack(null)
            fragmentTransaction.commit()
        }
        popupView.findViewById<Button>(R.id.update_button).setOnClickListener {
            updateProduct(popupView)
           // popupWindow.dismiss()

        }


    }
    private fun displayFragment(id: Int) {
        lateinit var fragment: Fragment
        if (id == R.id.nav_product_page_details) {
            fragment = HomeFragment()
        }
        activity?.supportFragmentManager?.beginTransaction()
                ?.replace(R.id.nav_host_fragment, fragment)
                ?.commit()
        (activity as HomePageActivity).drawer.closeDrawer(GravityCompat.START)
    }
    private fun updateProduct(view: View) {
        val description = view.findViewById<EditText>(R.id.product_description).text.toString()
        val name = view.findViewById<EditText>(R.id.product_name).text.toString()
        val category = view.findViewById<EditText>(R.id.product_category).text.toString()
        val brand = view.findViewById<EditText>(R.id.product_brand).text.toString()
        val stock = view.findViewById<EditText>(R.id.product_stock).text.toString()
        val price = view.findViewById<EditText>(R.id.product_price).text.toString()
        val id = product.id.toString()
        if (!priceInputCheck(price.toFloat())) {
            Toast.makeText(activity?.applicationContext, "Price must be bigger than zero", Toast.LENGTH_SHORT).show()
        } else {
            if (!stockInputCheck(stock.toInt())) {
                Toast.makeText(activity?.applicationContext, "Stock must be bigger than zero", Toast.LENGTH_SHORT).show()
            } else {
                if (!Uri.EMPTY.equals(image_uri)) {
                    var filePath = getPathFromURI(requireContext(), image_uri!!)
                    var file = File(filePath)
                    Log.i("filePath: ", filePath.toString())
                    Log.i("file.name: ", file.name.toString())

                    var requestFile = file.asRequestBody(MEDIA_TYPE_IMAGE)
                    var p_photo = MultipartBody.Part.createFormData(MEDIA_TYPE_PHOTO, file.name, requestFile!!)
                    // add another part within the multipart request
                    val p_id = id.toRequestBody(MEDIA_TYPE_TEXT);
                    val p_name  = name.toRequestBody(MEDIA_TYPE_TEXT);
                    val p_category = category.toRequestBody(MEDIA_TYPE_TEXT)
                    val p_brand = brand.toRequestBody(MEDIA_TYPE_TEXT)
                    val p_stock = stock.toRequestBody(MEDIA_TYPE_TEXT)
                    val p_price = price.toRequestBody(MEDIA_TYPE_TEXT)
                    val p_description = description.toRequestBody(MEDIA_TYPE_TEXT)

                    //The gson builder
                    val gson = GsonBuilder()
                            .setLenient()
                            .create()
                    //creating retrofit object
                    val retrofit: Retrofit = Retrofit.Builder()
                            .baseUrl(ApiEndpoints.API_URL)
                            .addConverterFactory(GsonConverterFactory.create(gson))
                            .build()
                    //creating api
                    val api: ApiService = retrofit.create(ApiService::class.java)
                    //creating a call and calling the upload image method
                    api.updateProductWithPhoto(auth_token, p_id, p_name, p_category, p_description, p_brand, p_stock, p_price, p_photo).enqueue(object :
                            Callback<ResponseBody> {
                        override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                            Log.i("MainFragment", "error" + p1?.message.toString())
                        }

                        override fun onResponse(
                                p0: Call<ResponseBody>?,
                                response: Response<ResponseBody>?
                        ) {
                            if (response != null) {
                                if (response.code() == 200) {
                                    Toast.makeText(context, "Product has been successfully updated", Toast.LENGTH_SHORT).show()
                                    //showPopupWindow(view)
                                    Log.i("Status code", response.code().toString())


                                } else if (response.code() == 400) {
                                    Log.v("Error code 400", response?.errorBody()?.string());
                                } else {
                                    Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                                    Log.i("Status code", response.code().toString())
                                    Log.i("MainFragment", response?.message().toString())
                                    // Toast.makeText(applicationContext, p0?.message.toString(), Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                    })
                }else{ //product update without photo
                    val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
                    apiinterface.updateProduct(auth_token, id.toInt(), category, name, description, brand, stock.toInt(), price.toFloat(), "").enqueue(object :
                            Callback<ResponseBody> {
                        override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                            Log.i("MainFragment", "error" + p1?.message.toString())
                        }

                        override fun onResponse(
                                p0: Call<ResponseBody>?,
                                response: Response<ResponseBody>?
                        ) {
                            if (response != null) {
                                if (response.code() == 200) {
                                    Toast.makeText(context, "Product has been successfully updated", Toast.LENGTH_SHORT).show()
                                   // (activity as HomePageActivity).displayFragment(R.id.nav_home, 5, "My Products", null)
                                    Log.i("Status code", response.code().toString())

                                } else if (response.code() == 400) {
                                    Log.v("Error code 400", response?.errorBody()?.string());
                                } else {
                                    Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                                    Log.i("Status code", response.code().toString())
                                    Log.i("MainFragment", response?.message().toString())
                                    // Toast.makeText(applicationContext, p0?.message.toString(), Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                    })
                }
            }
        }


    }

    fun priceInputCheck(price:Float):Boolean{
        try {
            if(price < 0){
                return false
            }
            return true
        }catch (e: Exception){
            return false
        }
    }
    fun stockInputCheck(stock:Int):Boolean{
        try {
            if (stock < 0) {
                return false
            }
            return true
        }catch (e: Exception){
            return false
        }
    }

    fun getDetails(id: Int, view: View){
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

                    reviewsText=view.findViewById(R.id.Reviews)
                    noReviewsText=view.findViewById(R.id.NoReviews)
                    commentListView = view.findViewById(R.id.commentListView)

                    if(commentList.isEmpty()){
                        noReviewsText.visibility = View.VISIBLE
                        reviewsText.visibility = View.INVISIBLE
                        commentListView.visibility = View.INVISIBLE
                    }else {
                        val adapter = context?.let { CommentAdapter(it, commentList) }
                        commentListView.adapter = adapter
                        noReviewsText.visibility = View.INVISIBLE
                        reviewsText.visibility = View.VISIBLE
                        commentListView.visibility = View.VISIBLE
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
                    .resize(800, 1000)
                    .onlyScaleDown()
                    .into(image)
        }
        else{
            image.setImageResource(R.drawable.ic_menu_camera)
        }
    }
    private fun deleteProduct(view: View) {
        val id = product.id
        if (id != null) {
            val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
            apiInterface.deleteProduct(auth_token, id).enqueue(object :
                    Callback<ResponseBody> {
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
                            Toast.makeText(context, "Product has been successfully deleted", Toast.LENGTH_SHORT).show()
                            (activity as HomePageActivity).displayFragment(R.id.nav_home,5,"My Products",null)
                        } else {
                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                        }

                    }

                }

            })

          }
    }
    private fun listVendorProducts() {
        val apiInterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
        apiInterface.getProductsOfVendor(auth_token).enqueue(object : retrofit2.Callback<VendorDataResponse> {
            override fun onFailure(p0: Call<VendorDataResponse>?, p1: Throwable?) {
                Log.i("Vendor Product List: ", "error: " + p1?.message.toString())
            }
            override fun onResponse(
                    p0: Call<VendorDataResponse>?,
                    response: Response<VendorDataResponse>?
            ) {
                if (response != null) {
                    if (response.body() != null) {
                        Log.i("MainFragment", "inside onResponse")
                        vendorProductList=ArrayList(response.body()!!.products)
                        val adapter = context?.let { VendorProductAdapter(it, vendorProductList) }
                        val gridView = view?.findViewById<GridView>(R.id.gridView)
                        if (gridView != null) {
                            gridView.adapter = adapter
                            gridView.setOnItemClickListener { _, view, _, _ ->
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
                            }
                        }
                    }else{
                        Log.i("Vendor Products: ", "have not any product")
                        Toast.makeText(context, "have not any product", Toast.LENGTH_SHORT).show()
                    }
                }
            }
        })
    }

    private val pickImageListener = View.OnClickListener { view ->
        //permission denied
        if (ContextCompat.checkSelfPermission(context as Context, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_DENIED){
            val permissions = arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE);
            requestPermissions(permissions, PERMISSION_CODE);
        }
        else{
            pickImageFromGallery(); //permission granted
        }
    }

    companion object {
        private val IMAGE_PICK_CODE = 1000;
        private val PERMISSION_CODE = 1001;
        fun newInstance(): VendorProductPageFragment {
            val newFragment = VendorProductPageFragment()
            val args = Bundle()
            newFragment.arguments = args
            return newFragment
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        when(requestCode){
            PERMISSION_CODE -> {
                if (grantResults.size > 0 && grantResults[0] ==
                        PackageManager.PERMISSION_GRANTED) {
                    pickImageFromGallery()
                } else {
                    Toast.makeText(context, "Permission denied", Toast.LENGTH_SHORT).show()

                }
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        if (resultCode == Activity.RESULT_OK && requestCode == IMAGE_PICK_CODE){
            image_view.setImageURI(data?.data)
            Toast.makeText(context, "Photo is picked", Toast.LENGTH_SHORT).show()
            Log.i("MainFragment", data?.dataString)
            image_uri = data?.data
        }
    }

    private fun pickImageFromGallery() {
        val intent = Intent(Intent.ACTION_PICK)
        intent.type = "image/*"
        startActivityForResult(intent, IMAGE_PICK_CODE)
    }

    private fun getPathFromURI(context: Context, uri: Uri): String? {
        val path: String = uri.path as String
        var realPath: String? = null

        val databaseUri: Uri
        val selection: String?
        val selectionArgs: Array<String>?
        if (path.contains("/document/image:")) { // files selected from the path
            databaseUri = MediaStore.Images.Media.EXTERNAL_CONTENT_URI
            selection = "_id=?"
            selectionArgs = arrayOf(DocumentsContract.getDocumentId(uri).split(":")[1])
        } else { // files selected from all other sources
            databaseUri = uri
            selection = null
            selectionArgs = null
        }
        try {
            val projection = arrayOf(
                    MediaStore.Images.Media.DATA,
                    MediaStore.Images.Media._ID,
                    MediaStore.Images.Media.ORIENTATION,
                    MediaStore.Images.Media.DATE_TAKEN
            ) // some example data you can query
            val cursor = context.contentResolver.query(
                    databaseUri,
                    projection, selection, selectionArgs, null
            )
            if (cursor!!.moveToFirst()) {
                val columnIndex = cursor.getColumnIndex(projection[0])
                realPath = cursor.getString(columnIndex)
            }
            cursor.close()
        } catch (e: Exception) {
            Log.i("Error:", "there is an error about path")

        }
        return realPath
    }

    class VendorProductAdapter : BaseAdapter {
        var productList = ArrayList<VendorProductLists>()
        var productImages = ArrayList<ImageView>()
        var context: Context? = null

        constructor(context: Context, productList: ArrayList<VendorProductLists>) : super() {
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
                    .resize(800, 1000)
                    .onlyScaleDown()
                    .into(image)
            //val url = URL(productList[position].photo_url)
            //val bmp = BitmapFactory.decodeStream(url.openConnection().getInputStream())
            //productView.findViewById<ImageView>(R.id.img_product).setImageBitmap(bmp)
            return productView
        }
    }
}
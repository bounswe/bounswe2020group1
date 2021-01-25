package com.example.tursuapp.authentication.homepage.ui.product

import android.Manifest
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
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.core.content.ContextCompat.checkSelfPermission
import androidx.fragment.app.Fragment
import com.example.tursuapp.R
import com.example.tursuapp.api.ApiEndpoints
import com.example.tursuapp.api.ApiService
import com.example.tursuapp.api.RetrofitClient
import com.example.tursuapp.authentication.homepage.HomePageActivity
import com.google.gson.GsonBuilder
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.ResponseBody
import retrofit2.Call
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.io.File


class ProductAddFragment: Fragment() {

    lateinit var auth_token :String
    private var image_uri : Uri? = Uri.EMPTY
    private lateinit var image_view : ImageView
    private lateinit var nameOfProduct : EditText
    private lateinit var descriptionOfProduct : EditText
    private lateinit var brandOfProduct : EditText
    private lateinit var stockOfProduct : EditText
    private lateinit var priceOfProduct : EditText
    var MEDIA_TYPE_TEXT = "text/plain".toMediaTypeOrNull()
    var MEDIA_TYPE_IMAGE = "image/*".toMediaTypeOrNull()
    var MEDIA_TYPE_PHOTO = "photo"

    override fun onCreateView(
            inflater: LayoutInflater,
            container: ViewGroup?,
            savedInstanceState: Bundle?
    ): View? {

        val pref = context?.getSharedPreferences("UserPref", 0)
        auth_token = pref?.getString("auth_token", null).toString()
        val root = inflater.inflate(R.layout.fragment_productadd, container, false)

        nameOfProduct = root.findViewById(R.id.addProduct_name) as EditText
        descriptionOfProduct = root.findViewById(R.id.addProduct_description) as EditText
        brandOfProduct = root.findViewById(R.id.addProduct_brand) as EditText
        stockOfProduct = root.findViewById(R.id.addProduct_stock) as EditText
        priceOfProduct = root.findViewById(R.id.addProduct_price) as EditText

        var addProduct=  root.findViewById(R.id.addProduct_button) as Button
        var pickImage = root.findViewById(R.id.product_add_pick_image) as Button
        image_view = root.findViewById(R.id.product_add_image_view) as ImageView
        pickImage.setOnClickListener(pickImageListener)
        addProduct.setOnClickListener {
            // Build AlertDialog
            val dialogBuilder = AlertDialog.Builder(root.context)

            // set message of alert dialog
            dialogBuilder.setMessage("Do you want to add the product?")
                    // if the dialog is cancelable
                    .setCancelable(false)
                    // positive button text and action
                    .setPositiveButton("Proceed", DialogInterface.OnClickListener { dialog, id ->
                        productadd(root)
                    })
                    // negative button text and action
                    .setNegativeButton("Cancel", DialogInterface.OnClickListener { dialog, id ->
                        dialog.cancel()
                    })

            // create dialog box
            val alert = dialogBuilder.create()
            // set title for alert dialog box
            alert.setTitle("Add Product")
            // show alert dialog
            alert.show()
            //

        }
        return root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        val spinner = view.findViewById<Spinner>(R.id.spinner2)
        val items = arrayOf("Categories", "Electronics", "Fashion", "Home", "Cosmetics", "Sports")
        val adapter = context?.let { ArrayAdapter(it, android.R.layout.simple_spinner_dropdown_item, items) }
        if (spinner != null) {
            spinner.adapter = adapter
        }
        view.findViewById<ImageView>(R.id.back_img).setOnClickListener {
            (activity as HomePageActivity).displayFragment(R.id.nav_home, 5, "Products On Sale", null)
        }
    }
    fun productadd(view: View) {
        var name = nameOfProduct.text.toString().trim()
        var description = descriptionOfProduct.text.toString().trim()
        var brand = brandOfProduct.text.toString().trim()
        var stock = stockOfProduct.text.toString().trim()
        var price = priceOfProduct.text.toString().trim()
        val spinner = view.findViewById<Spinner>(R.id.spinner2)
        Log.i("category", spinner.selectedItem.toString())
        val category = spinner.selectedItem.toString()
        if (category != "Categories") {
            if (name.isEmpty()) {
                nameOfProduct.error = "Name is required."
                nameOfProduct.requestFocus()
            }
            if (description.isEmpty()) {
                descriptionOfProduct.error = "Description is required."
                descriptionOfProduct.requestFocus()
            }
            if (brand.isEmpty()) {
                brandOfProduct.error = "Brand is required."
                brandOfProduct.requestFocus()
            }
            if (stock.isEmpty()) {
                stockOfProduct.error = "Stock is required."
                stockOfProduct.requestFocus()
            }
            if (price.isEmpty()) {
                priceOfProduct.error = "Price is required."
                priceOfProduct.requestFocus()
            }
            if (name.isEmpty() || brand.isEmpty() || stock.isEmpty() || price.isEmpty() || description.isEmpty()) {
                Toast.makeText(context, "Input all product details ", Toast.LENGTH_SHORT).show()
            } else {
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

                            var p_photo: MultipartBody.Part? = null
                            var requestFile = file.asRequestBody(MEDIA_TYPE_IMAGE)
                            p_photo = MultipartBody.Part.createFormData(MEDIA_TYPE_PHOTO, file.name, requestFile!!)
                            // add another part within the multipart request
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
                            api.addProductWithPhoto(auth_token, p_name, p_category, p_description, p_brand, p_stock, p_price, p_photo).enqueue(object :
                                    retrofit2.Callback<ResponseBody> {
                                override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                                    Log.i("MainFragment", "error" + p1?.message.toString())
                                }

                                override fun onResponse(
                                        p0: Call<ResponseBody>?,
                                        response: Response<ResponseBody>?
                                ) {
                                    //   val applicationContext = getActivity()?.getApplicationContext()
                                    if (response != null) {
                                        if (response.code() == 200) {
                                            Toast.makeText(context, "Product has been successfully added. Contact ADMIN for the verification of your product", Toast.LENGTH_LONG).show()
                                            //showPopupWindow(view)
                                            Log.i("Status code", response.code().toString())

                                            //clear textviews
                                            view.findViewById<EditText>(R.id.addProduct_name).text.clear()
                                            view.findViewById<EditText>(R.id.addProduct_brand).text.clear()
                                            view.findViewById<EditText>(R.id.addProduct_stock).text.clear()
                                            view.findViewById<EditText>(R.id.addProduct_price).text.clear()
                                            view.findViewById<EditText>(R.id.addProduct_description).text.clear()
                                        } else if (response.code() == 400) {
                                            Log.v("Error code 400", response?.errorBody()?.string());
                                        } else {
                                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                                            Log.i("Status code", response.code().toString())
                                            Log.i("MainFragment", response?.message().toString())
                                            // Toast.makeText(context, p0?.message.toString(), Toast.LENGTH_SHORT).show()
                                        }
                                    }
                                }
                            })
                        }else{ //product add without photo
                            val apiinterface: ApiService = RetrofitClient().getClient().create(ApiService::class.java)
                            apiinterface.addProduct(auth_token, name, category, description, brand, stock.toInt(), price.toFloat(), "").enqueue(object :
                                    retrofit2.Callback<ResponseBody> {
                                override fun onFailure(p0: Call<ResponseBody>?, p1: Throwable?) {
                                    Log.i("MainFragment", "error" + p1?.message.toString())
                                }

                                override fun onResponse(
                                        p0: Call<ResponseBody>?,
                                        response: Response<ResponseBody>?
                                ) {
                                    val applicationContext = getActivity()?.getApplicationContext()
                                    if (response != null) {
                                        if (response.code() == 200) {
                                            Toast.makeText(context, "Product has been successfully added", Toast.LENGTH_SHORT).show()
                                            Log.i("Status code", response.code().toString())

                                            //clear textviews
                                            view.findViewById<EditText>(R.id.addProduct_name).text.clear()
                                            view.findViewById<EditText>(R.id.addProduct_brand).text.clear()
                                            view.findViewById<EditText>(R.id.addProduct_stock).text.clear()
                                            view.findViewById<EditText>(R.id.addProduct_price).text.clear()
                                            view.findViewById<EditText>(R.id.addProduct_description).text.clear()
                                        } else if (response.code() == 400) {
                                            Log.v("Error code 400", response?.errorBody()?.string());
                                        } else {
                                            Toast.makeText(context, response.code().toString(), Toast.LENGTH_SHORT).show()
                                            Log.i("Status code", response.code().toString())
                                            Log.i("MainFragment", response?.message().toString())
                                            // Toast.makeText(context, p0?.message.toString(), Toast.LENGTH_SHORT).show()
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            }
        }else {
            Toast.makeText(context, "Select a category", Toast.LENGTH_SHORT).show()
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
    private val pickImageListener = View.OnClickListener { view ->
        //permission denied
        if (checkSelfPermission(context as Context, Manifest.permission.READ_EXTERNAL_STORAGE) == PackageManager.PERMISSION_DENIED){
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
        fun newInstance(): ProductAddFragment {
            val newFragment = ProductAddFragment()
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

}




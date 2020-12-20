package com.example.tursuapp.authentication.homepage

import android.os.Bundle
import android.view.MenuItem
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ExpandableListView
import android.widget.ExpandableListView.OnGroupClickListener
import android.widget.Spinner
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import com.example.tursuapp.R
import com.example.tursuapp.authentication.ExpandableListAdapter
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.example.tursuapp.authentication.homepage.ui.product.ProductAddFragment
import com.google.android.material.navigation.NavigationView


class HomePageActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {
    var listAdapter: ExpandableListAdapter? = null
    var expListView: ExpandableListView? = null
    var listDataHeader: MutableList<String>? = null
    var listDataChild: HashMap<String, List<String>>? = null


    private lateinit var drawer: DrawerLayout
    private lateinit var toggle: ActionBarDrawerToggle
    lateinit var mView: View

    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        //otomatik kapanması için
        drawer.closeDrawer(GravityCompat.START)
        return true
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home_page)
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        val navigationView: NavigationView = findViewById(R.id.nav_view)
        navigationView.setNavigationItemSelectedListener(this)

        drawer = findViewById(R.id.drawer_layout)
        toggle = ActionBarDrawerToggle(this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close)
        drawer.addDrawerListener(toggle)
        toggle.syncState();
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false);
        toolbar.setNavigationIcon(R.drawable.hamburger)
        supportActionBar?.setHomeButtonEnabled(true)
        expListView = findViewById<View>(R.id.lvExp) as ExpandableListView
        prepareListData()
        listAdapter = listDataHeader?.let { listDataChild?.let { it1 -> ExpandableListAdapter(this, it, it1) } }
        expListView!!.setAdapter(listAdapter)
        expListView!!.setOnGroupClickListener(OnGroupClickListener { parent, v, groupPosition, id ->
            when (groupPosition) {
                0 -> displayFragment(R.id.nav_home, "")
            }
            false
        })
        expListView!!.setOnChildClickListener(ExpandableListView.OnChildClickListener { parent, v, groupPosition, childPosition, id ->
            // Kategoriye basılınca olacakları ayarla
            if (groupPosition == 1) {
                when (childPosition) {
                    0 -> displayFragment(R.id.nav_home, "Electronics")
                    1 -> displayFragment(R.id.nav_home, "Fashion")
                    2 -> displayFragment(R.id.nav_home, "Home")
                    3 -> displayFragment(R.id.nav_home, "Cosmetics")
                    4 -> displayFragment(R.id.nav_home, "Sports")
                }
            }

            false
        })
        expListView!!.setOnChildClickListener(ExpandableListView.OnChildClickListener { parent, v, groupPosition, childPosition, id ->
            // Product Operations
            if (groupPosition == 2) {
                when (childPosition) {
                    0 -> displayOperations(R.id.nav_home, "ProductAdd")
                    //1 -> displayOperations(R.id.nav_home, "ProductUpdate")
                    //2 -> displayOperations(R.id.nav_home, "ProductDelete")
                }
            }

            false
        })

        this.findViewById<Button>(R.id.search_button).setOnClickListener {
            val editText: EditText? = findViewById(R.id.editMobileNo)
            editText?.text?.clear();
            if (editText != null) {
                val searchText=editText.text
                search(searchText.toString())
            }
        }

            /*
           // spinner.setSelection(-1);
            addProductName?.text?.clear();
            addProductBrand?.text?.clear();
            addProductStock?.text?.clear();
            addProductPrice?.text?.clear();
            addProductPhoto?.text?.clear();
            addProductDescription?.text?.clear();

            if (addProductName != null && addProductBrand != null && addProductStock != null && addProductPrice != null && addProductPhoto != null && addProductDescription != null) {
                val name=addProductName.text
                val brand=addProductBrand.text
                val stock=addProductStock.text
                val price=addProductPrice.text
                val photo=addProductPhoto.text
                val description=addProductDescription.text

               // addProduct(name.toString(),brand.toString(),stock.toString(),price.toString(),photo.toString(),description.toString())
            }
             */
        //}

        expListView!!.setSelectedGroup(0)

    }
    override fun onBackPressed() {
        val count = fragmentManager.backStackEntryCount
        if (count == 0) {
            super.onBackPressed()
        } else {
            fragmentManager.popBackStack()
        }
    }

    fun addProduct(name: String, brand: String, stock: String, price: String, photo: String, description: String){
        lateinit var fragment: Fragment
        fragment = ProductAddFragment()
        val bundle = Bundle()
        bundle.putString("name", name)
        bundle.putString("brand", brand)
        bundle.putString("stock", stock)
        bundle.putString("price", price)
        bundle.putString("photo", photo)
        bundle.putString("description", description)
        fragment.arguments = bundle

        supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, fragment)
                .commit()
        this.drawer.closeDrawer(GravityCompat.START)

    }

    fun search(type: String){
        lateinit var fragment: Fragment
            fragment = HomeFragment()
            val bundle = Bundle()
            bundle.putString("type", type)
            bundle.putString("id", "2")
            fragment.arguments = bundle

        supportFragmentManager.beginTransaction()
            .replace(R.id.nav_host_fragment, fragment)
            .commit()
        this.drawer.closeDrawer(GravityCompat.START)
    }
    fun displayOperations(id: Int, type: String){
        lateinit var fragment: Fragment
        when (id) {
            R.id.nav_home -> fragment = ProductAddFragment()
        }
        supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, fragment)
                .commit()
        this.drawer.closeDrawer(GravityCompat.START)
    }
    fun displayFragment(id: Int, type: String){
        lateinit var fragment: Fragment
        when (id) {
            R.id.nav_home -> fragment = HomeFragment()
        }
        if(type!="") {
            val bundle = Bundle()
            bundle.putString("type", type)
            bundle.putString("id", "1")
            fragment.arguments = bundle
        }
        supportFragmentManager.beginTransaction()
                .replace(R.id.nav_host_fragment, fragment)
                .commit()
        this.drawer.closeDrawer(GravityCompat.START)
    }
    /*
     * Preparing the list data
     */
    private fun prepareListData() {
        listDataHeader = ArrayList()
        listDataChild = HashMap()

        // Adding child data
        (listDataHeader as ArrayList<String>).add("Home")
        (listDataHeader as ArrayList<String>).add("Categories")
        (listDataHeader as ArrayList<String>).add("Product")

        // Adding child data
        val category_names: MutableList<String> = ArrayList()
        /*# category1 --> Electronics
    # category2 --> Fashion
    # category3 --> Home
    # category4 --> Cosmetics
    # category5 --> Sports
*/
        category_names.add("Electronics")
        category_names.add("Fashion")
        category_names.add("Home")
        category_names.add("Cosmetics")
        category_names.add("Sports")

        val productOp_names: MutableList<String> = ArrayList()
        productOp_names.add("Product Add")
        productOp_names.add("Product Update")
        productOp_names.add("Product Delete")
        listDataChild!![(listDataHeader as ArrayList<String>).get(0)] = ArrayList()
        listDataChild!![(listDataHeader as ArrayList<String>).get(1)] = category_names
        listDataChild!![(listDataHeader as ArrayList<String>).get(2)] = productOp_names
        //listDataChild!![(listDataHeader as ArrayList<String>).get(2)] = comingSoon
    }

}
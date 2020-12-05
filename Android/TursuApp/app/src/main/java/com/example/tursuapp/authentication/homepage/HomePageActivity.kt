package com.example.tursuapp.authentication.homepage

import android.os.Bundle
import android.view.Gravity
import android.view.LayoutInflater
import android.view.MenuItem
import android.view.View
import android.widget.*
import android.widget.ExpandableListView.OnGroupClickListener
import androidx.appcompat.app.ActionBarDrawerToggle
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.fragment.app.Fragment
import com.example.tursuapp.R
import com.example.tursuapp.authentication.ExpandableListAdapter
import com.example.tursuapp.authentication.homepage.ui.home.HomeFragment
import com.google.android.material.navigation.NavigationView


class HomePageActivity : AppCompatActivity(), NavigationView.OnNavigationItemSelectedListener {
    var listAdapter: ExpandableListAdapter? = null
    var expListView: ExpandableListView? = null
    var listDataHeader: MutableList<String>? = null
    var listDataChild: HashMap<String, List<String>>? = null
    private lateinit var drawer: DrawerLayout
    private lateinit var toggle: ActionBarDrawerToggle

/*
Type 0 -> all products
Type 1 -> category
Type 2 -> search
Type 3 -> filter
Type 4 -> sort
 */
    override fun onNavigationItemSelected(item: MenuItem): Boolean {
        //otomatik kapanması için
        drawer.closeDrawer(GravityCompat.START)
        return true
    }
    private fun setAppBar(){
        val toolbar: Toolbar = findViewById(R.id.toolbar)
        setSupportActionBar(toolbar)
        val navigationView: NavigationView = findViewById(R.id.nav_view)
        navigationView.setNavigationItemSelectedListener(this)
        drawer = findViewById(R.id.drawer_layout)
        toggle = ActionBarDrawerToggle(this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close)
        drawer.addDrawerListener(toggle)
        toggle.syncState()
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.setDisplayShowTitleEnabled(false)
        toolbar.setNavigationIcon(R.drawable.hamburger)
        supportActionBar?.setHomeButtonEnabled(true)
    }
    private fun setExpandablesSideMenu(){
        expListView = findViewById<View>(R.id.lvExp) as ExpandableListView
        prepareListData()
        listAdapter = listDataHeader?.let { listDataChild?.let { it1 -> ExpandableListAdapter(this, it, it1) } }
        expListView!!.setAdapter(listAdapter)
        expListView!!.setOnGroupClickListener(OnGroupClickListener { parent, v, groupPosition, id ->
            when (groupPosition) {
                0 -> displayFragment(R.id.nav_home, 0, "")
            }
            false
        })
        expListView!!.setOnChildClickListener(ExpandableListView.OnChildClickListener { parent, v, groupPosition, childPosition, id ->
            // Kategoriye basılınca olacakları ayarla
            if (groupPosition == 1) {
                when (childPosition) {
                    0 -> displayFragment(R.id.nav_home, 1, "Electronics")
                    1 -> displayFragment(R.id.nav_home, 1, "Fashion")
                    2 -> displayFragment(R.id.nav_home, 1, "Home")
                    3 -> displayFragment(R.id.nav_home, 1, "Cosmetics")
                    4 -> displayFragment(R.id.nav_home, 1, "Sports")
                }
            }

            false
        })
        expListView!!.setSelectedGroup(0)
    }
    private fun setFilterFunction(){
        val filter = findViewById<ImageView>(R.id.filter_image)
        filter.setOnClickListener {
            showPopupWindow(it)
        }
    }
    private fun setSearchFunction(){
        this.findViewById<Button>(R.id.search_button).setOnClickListener {
            val editText: EditText? = findViewById(R.id.editMobileNo)

            if (editText != null) {
                val searchText=editText.text
                displayFragment(R.id.nav_home, 2, searchText.toString())
                //search(searchText.toString())
            }
            editText?.text?.clear()
        }
    }
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home_page)
        setAppBar()
        setExpandablesSideMenu()
        setSearchFunction()
        setFilterFunction()
    }
    override fun onBackPressed() {
        val count = fragmentManager.backStackEntryCount
        if (count == 0) {
            super.onBackPressed()
        } else {
            fragmentManager.popBackStack()
        }
    }
    private fun setVendorRadioButtons(view:View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupVendors)
        val btn1 = RadioButton(this)
        btn1.text = "vendor 1"
        radioGroup.addView(btn1)
        val btn2 = RadioButton(this)
        btn2.text = "vendor 2"
        radioGroup.addView(btn2)
        val btn3 = RadioButton(this)
        btn3.text = "vendor 3"
        radioGroup.addView(btn3)

    }
    private fun setBrandRadioButtons(view:View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupBrands)
        val btn1 = RadioButton(this)
        btn1.text = "brand 1"
        val btn2 = RadioButton(this)
        btn2.text = "brand 2"
        val btn3 = RadioButton(this)
        btn3.text = "brand 3"
        radioGroup.addView(btn1)
        radioGroup.addView(btn2)
        radioGroup.addView(btn3)
    }
    private fun setCategoryRadioButtons(view:View){
        val radioGroup = view.findViewById<RadioGroup>(R.id.radioGroupCategory)
        val btn1 = RadioButton(this)
        btn1.text = "category 1"
        val btn2 = RadioButton(this)
        btn2.text = "category 2"
        val btn3 = RadioButton(this)
        btn3.text = "category 3"
        radioGroup.addView(btn1)
        radioGroup.addView(btn2)
        radioGroup.addView(btn3)
    }
    private fun showPopupWindow(view: View) {
        //Create a View object yourself through inflater
        val inflater = view.context.getSystemService(LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val popupView: View = inflater.inflate(R.layout.filter_popup_layout, null)
        setVendorRadioButtons(popupView)
        setBrandRadioButtons(popupView)
        setCategoryRadioButtons(popupView)
        //Specify the length and width through constants
        val width = LinearLayout.LayoutParams.MATCH_PARENT
        val height = LinearLayout.LayoutParams.MATCH_PARENT

        //Make Inactive Items Outside Of PopupWindow
        val focusable = true

        //Create a window with our parameters
        val popupWindow = PopupWindow(popupView, width, height, focusable)

        //Set the location of the window on the screen
        popupWindow.showAtLocation(view, Gravity.CENTER, 0, 0)

    }
    private fun displayFragment(id: Int, type: Int, keys: String){
        lateinit var fragment: Fragment
        if(id==R.id.nav_home){
            fragment = HomeFragment()
        }
        val bundle = Bundle()
        bundle.putInt("type", type)
        bundle.putString("keys", keys)
        fragment.arguments = bundle
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
        listDataChild!![(listDataHeader as ArrayList<String>).get(0)] = ArrayList()
        listDataChild!![(listDataHeader as ArrayList<String>).get(1)] = category_names
        //listDataChild!![(listDataHeader as ArrayList<String>).get(2)] = comingSoon
    }
}
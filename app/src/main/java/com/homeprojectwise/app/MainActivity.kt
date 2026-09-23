package com.homeprojectwise.app

import android.os.Bundle
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val title = TextView(this).apply {
            text = "HomeProjectWise"
            textSize = 28f
            setPadding(32, 64, 32, 32)
        }

        setContentView(title)
    }
}

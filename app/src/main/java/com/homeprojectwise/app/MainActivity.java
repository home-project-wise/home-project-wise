package com.homeprojectwise.app;

import android.graphics.Color;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final int background = Color.rgb(247, 245, 240);
        final int primary = Color.rgb(36, 50, 56);
        final int secondary = Color.rgb(111, 143, 130);
        final int accent = Color.rgb(217, 119, 69);

        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        root.setGravity(Gravity.CENTER);
        root.setPadding(48, 48, 48, 48);
        root.setBackgroundColor(background);

        TextView title = new TextView(this);
        title.setText("HomeProjectWise");
        title.setTextColor(primary);
        title.setTextSize(32);
        title.setGravity(Gravity.CENTER);
        title.setTypeface(null, android.graphics.Typeface.BOLD);

        TextView subtitle = new TextView(this);
        subtitle.setText("DIY Home Improvement\n& Smart Home");
        subtitle.setTextColor(secondary);
        subtitle.setTextSize(18);
        subtitle.setGravity(Gravity.CENTER);
        subtitle.setPadding(0, 20, 0, 0);

        TextView status = new TextView(this);
        status.setText("Your home projects, ideas and guides — all in one place.");
        status.setTextColor(primary);
        status.setTextSize(16);
        status.setGravity(Gravity.CENTER);
        status.setPadding(0, 28, 0, 0);

        root.addView(title, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT));

        root.addView(subtitle, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT));

        root.addView(status, new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT));

        setContentView(root);
    }
}

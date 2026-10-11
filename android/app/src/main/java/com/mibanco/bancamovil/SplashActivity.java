package com.mibanco.bancamovil;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.ProgressBar;

import androidx.appcompat.app.AppCompatActivity;

import com.facebook.drawee.backends.pipeline.Fresco;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.SimpleDraweeView;
import com.facebook.imagepipeline.request.ImageRequest;
import com.facebook.imagepipeline.request.ImageRequestBuilder;

public class SplashActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);

        SimpleDraweeView logo = findViewById(R.id.logo);
        ProgressBar progressBar = findViewById(R.id.progressBar);

        progressBar.setVisibility(View.INVISIBLE);

        ImageRequest imageRequest = ImageRequestBuilder.newBuilderWithResourceId(R.drawable.splash).build();
        DraweeController controller = Fresco.newDraweeControllerBuilder()
                .setUri(imageRequest.getSourceUri())
                .setAutoPlayAnimations(true)
                .build();

        logo.setController(controller);

        new android.os.Handler().postDelayed(() -> progressBar.setVisibility(View.VISIBLE), 4 * 1000);

        new android.os.Handler().postDelayed(() -> {
                    logo.setVisibility(View.GONE);
                    progressBar.setVisibility(View.VISIBLE);
                }
                , 60 * 1000);

        new android.os.Handler().postDelayed(() -> {
                    logo.setVisibility(View.GONE);
                    progressBar.setVisibility(View.GONE);
                }
                , 2 * 60 * 1000);

        if (getCallingActivity().getPackageName().equals("com.mibanco.bancamovil")) {
            Intent intent = new Intent(this, MainActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION);
            startActivity(intent);
        }
    }

}

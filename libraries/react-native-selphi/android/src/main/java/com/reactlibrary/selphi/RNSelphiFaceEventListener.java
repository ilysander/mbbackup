package com.reactlibrary.selphi;

import androidx.annotation.NonNull;
import com.facephi.fphiwidgetcore.IFPhiWidgetEventListener;

public class RNSelphiFaceEventListener implements IFPhiWidgetEventListener {
    @Override
    public void onEvent(long time, @NonNull String type, @NonNull String info) {
        // Return the info to the hybrid client
        RNSelphiFaceLogModel.getLogModel().setCurrentLogJSON(time+"", type, info);
    }
}
package com.reactlibrary.selphid;

import androidx.annotation.NonNull;

import com.facephi.fphiselphidwidgetcore.IFPhiWidgetSelphIDEventListener;

public class RNSelphidEventListener implements IFPhiWidgetSelphIDEventListener {
    @Override
    public void onEvent(long time, @NonNull String type, @NonNull String info) {
        RNSelphidLogModel.getLogModel().setCurrentLogJSON(time+"", type, info);
    }
}
package com.reactlibrary.selphid;

import com.facephi.fphiselphidwidgetcore.WidgetSelphIDScanMode;

public enum RNSelphidScanMode {
    SM_GENERIC("generic") {
        @Override
        public WidgetSelphIDScanMode getScanMode() {
            return WidgetSelphIDScanMode.SMGeneric;
        }
    },
    SM_SEARCH("search") {
        @Override
        public WidgetSelphIDScanMode getScanMode() {
            return WidgetSelphIDScanMode.SMSearch;
        }
    },
    SM_SPECIFIC("specific") {
        @Override
        public WidgetSelphIDScanMode getScanMode() { return WidgetSelphIDScanMode.SMSpecific; }
    };

    private final String name;

    RNSelphidScanMode(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public abstract WidgetSelphIDScanMode getScanMode();

}

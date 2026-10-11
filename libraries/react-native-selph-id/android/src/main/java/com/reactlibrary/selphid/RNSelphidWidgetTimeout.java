package com.reactlibrary.selphid;

import com.facephi.fphiselphidwidgetcore.WidgetTimeout;

public enum RNSelphidWidgetTimeout {
    TIMEOUT_SHORT("timeout_short") {
        @Override
        public WidgetTimeout getWidgetTimeout() {
            return WidgetTimeout.Short;
        }
    },
    TIMEOUT_MEDIUM("timeout_medium") {
        @Override
        public WidgetTimeout getWidgetTimeout() {
            return WidgetTimeout.Medium;
        }
    },
    TIMEOUT_LONG("timeout_long") {
        @Override
        public WidgetTimeout getWidgetTimeout() { return WidgetTimeout.Long; }
    };

    private final String name;

    RNSelphidWidgetTimeout(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public abstract WidgetTimeout getWidgetTimeout();
}

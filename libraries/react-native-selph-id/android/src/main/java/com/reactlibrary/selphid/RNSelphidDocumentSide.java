package com.reactlibrary.selphid;

import com.facephi.fphiselphidwidgetcore.WidgetSelphIDDocumentSide;

public enum RNSelphidDocumentSide {

    MODE_FRONT("mode_front") {
        @Override
        public WidgetSelphIDDocumentSide getDocumentSide() {
            return WidgetSelphIDDocumentSide.DSFront;
        }

        @Override
        public boolean getIsWizardMode() {
            return false;
        }
    },
    MODE_BACK("mode_back") {
        @Override
        public WidgetSelphIDDocumentSide getDocumentSide() {
            return WidgetSelphIDDocumentSide.DSBack;
        }

        @Override
        public boolean getIsWizardMode() {
            return false;
        }
    },
    MODE_WIZARD("mode_wizard") {
        @Override
        public WidgetSelphIDDocumentSide getDocumentSide() {
            return WidgetSelphIDDocumentSide.DSFront;
        }

        @Override
        public boolean getIsWizardMode() {
            return true;
        }
    };

    private final String name;

    RNSelphidDocumentSide(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public abstract WidgetSelphIDDocumentSide getDocumentSide();

    public abstract boolean getIsWizardMode();

}

package com.reactlibrary.selphi;

import java.util.Observable;

public class RNSelphiFaceObservableQR extends Observable {
    private Boolean isValid;

    public RNSelphiFaceObservableQR(Boolean isValid) {
        this.isValid = isValid;
    }

    public Boolean getIsValid() {
        return isValid;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
        setChanged();
        notifyObservers(isValid);
    }
}
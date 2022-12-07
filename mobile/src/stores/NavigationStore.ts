import { action, observable } from "mobx";
import { RootStore } from "./RootStore";
import { NavigationContainerRef } from "@react-navigation/native";

export class NavigationStore {
    private rootStore: RootStore;
    @observable ref: NavigationContainerRef;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @action setRef(ref: NavigationContainerRef) {
        this.ref = ref;
    }
}
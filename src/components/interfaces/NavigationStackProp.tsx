// import { NavigationProp } from "@react-navigation/native";

// export interface NativeNavigationStackProp<T extends {}> extends NavigationProp<T> {
//     replace:(screen:string,params:any)=>void;
// }

// export interface NavigationStackProp<T extends {}> {
//     navigation:NativeNavigationStackProp<any>;
//     route:{
//         params:T
//     }
// }

export interface NativeNavigationStackProp<NavParams extends {}> {
  replace: (screen: string, params?: NavParams) => void;
  navigate: (screen: string, params?: NavParams) => void;
}

export interface NavigationStackProp<NavParams extends {}> {
  navigation: NativeNavigationStackProp<NavParams>;
  route: {
    params: NavParams;
  };
}

/*

=======>>>> clase que envia los params

export default class LoginScene extends React.Component<NavigationStackProp<DemoSceneParams|DemoScene2Params>,State>{


}

//Para enviar parametros
const {navigation}= this.props;
navigation.navigate('App',{demo:'asdas'});

======>>> otra clase que recibe
export interface DemoSceneParams {
    demo:string;
}

//Para leerlos
const {navigation, route} = this.props;
const {demo} = route.params;

*/

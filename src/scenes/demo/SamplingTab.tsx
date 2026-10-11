import React, { Component } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { Colors } from '../../resources/constants';
// import { BarChart, LineChart } from 'react-native-chart-kit';
// import { NavigationStackProp } from '../../../components/interfaces/NavigationStackProp';
// import HeaderMain from '../../../components/screen/HeaderMain';
// import CardView from '../../../components/ui/CardView';
// import Text from '../../../components/ui/Text';
// import { Colors } from '../../../resources/constants';

interface State { }
export default class SamplingTab extends React.Component<
    any,
    State
>{


    render(): React.ReactNode {
        const { name } = this.props;
        return (
            <View style={{ flex: 1, backgroundColor: Colors.primary }}>
                {/* <SafeAreaView style={{ flex: 1 }}> */}
                <Text>Sampling {name}</Text>
                {/* </SafeAreaView> */}
            </View>
        )
    }

}
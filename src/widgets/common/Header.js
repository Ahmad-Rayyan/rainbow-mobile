/** Import libraries for making a component */

import React from 'react';
import { Text, View } from 'react-native';

/** Make a component */
const Header = (props) => {
    const { textStyle, viewStyle } = styles;
    return (
        <View style={viewStyle}>
            <Text style={textStyle}>{props.headerText}</Text>
        </View>
        );
};

const styles = {
    viewStyle: {
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        paddingTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 4 },
        shadowOpacity: 0.6,
        elevation: 2,
        poistion: 'relative'

    },
    textStyle: {
        fontSize: 20
    }
};
/** Make the component available to other parts of the app */
export { Header };

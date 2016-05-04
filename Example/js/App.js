import React, {
  Component,
  StyleSheet,
  Switch,
  Text,
  View
} from 'react-native';

import AnimatedSegmentedControl from './AnimatedSegmentedControl';

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      items: [
        { label: 'Item1', checked: true },
        { label: 'Item2', checked: true },
        { label: 'Item3', checked: true },
        { label: 'Item4', checked: true },
        { label: 'Item5', checked: true },
        { label: 'Item6', checked: true },
      ]
    };
  }
  
  render() {
    const { items } = this.state;

    const switches = items.map((item, idx) => (
      <View key={idx} style={styles.switch}>
        <Text>{item.label}</Text>
        <Switch
          value={item.checked}
          onValueChange={(val) => {
            item.checked = val;
            this.setState({ items });
          }}
        />
      </View>
    ));

    return (
      <View style={styles.container}>
        <AnimatedSegmentedControl
          style={styles.control}
          borderWidth={1}
          borderRadius={20}
          borderColor="rgba(229,163,48,1)"
          backgroundColor="rgba(229,163,48,1)"
          textColor="#fff"
          textPadding={10}
          selectedBackgroundColor="#fff"
          selectedTextColor="rgba(229,163,48,1)"
          values={items.filter((item) => item.checked).map((item) => item.label)}
        />
        {switches}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  switch: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  control: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 16,
    marginRight: 16
  }
});

import React, {
  Animated,
  Component,
  PropTypes,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';

export default class AnimatedSegmentedControl extends Component {

  static propTypes = {
    borderWidth: PropTypes.number,
    borderRadius: PropTypes.number,
    borderColor: PropTypes.string,
    backgroundColor: PropTypes.string,
    textPadding: PropTypes.number,
    textColor: PropTypes.string,
    selectedBorderRadius: PropTypes.number,
    selectedBackgroundColor: PropTypes.string,
    selectedTextColor: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
    onChange: PropTypes.func,
    onValueChange: PropTypes.func
  };

  static defaultProps = {
    borderWidth: 1,
    borderRadius: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    textPadding: 2,
    textColor: '#000',
    selectedBorderRadius: undefined,
    selectedBackgroundColor: '#000',
    selectedTextColor: '#fff',
    values: []
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      selectedIndex: 0,
      thumbPosition: new Animated.Value(0),
      textWidth: undefined,
      textHeight: undefined
    };
  }

  handleSelected(idx) {
    const { values, onChange, onValueChange } = this.props;
    const { thumbPosition } = this.state;

    onChange && onChange({ index: idx, value: values[idx] });
    onValueChange && onValueChange(values[idx]);

    this.setState({ selectedIndex: idx });
    Animated.spring(thumbPosition, { toValue: idx }).start();
  }

  handleTextsLayout(layouts) {
    let textHeight = 0;
    let textWidth = 0;
    layouts.forEach(({ width, height }) => {
      if (width >= textWidth) {
        textWidth = width;
        textHeight = height;
      }
    });
    if (textWidth === this.state.textWidth) return;
    this.setState({ textWidth, textHeight });
  }

  getRootStyle() {
    const {
      borderWidth,
      borderRadius,
      borderColor,
      backgroundColor,
      style
    } = this.props;

    return [
      styles.root,
      {
        borderWidth,
        borderRadius,
        borderColor,
        backgroundColor
      },
      style
    ];
  }

  getThumbStyle() {
    const { borderRadius, selectedBorderRadius, selectedBackgroundColor, values } = this.props;
    const { thumbPosition, textWidth = 0, textHeight } = this.state;
    return [
      styles.thumb,
      {
        width: textWidth,
        height: textHeight,
        borderRadius: selectedBorderRadius === undefined ? borderRadius : selectedBorderRadius,
        backgroundColor: selectedBackgroundColor,
        transform: [{
          translateX: thumbPosition.interpolate({
            inputRange: [0, values.length - 1],
            outputRange: [0, (values.length - 1) * textWidth]
          })
        }]
      }
    ];
  }

  getTextStyle(idx) {
    const { textPadding, textColor, selectedTextColor } = this.props;
    const { selectedIndex, textWidth } = this.state;

    return [
      styles.text,
      {
        width: textWidth,
        padding: textPadding,
        color: selectedIndex === idx ? selectedTextColor : textColor
      }
    ];
  }

  render() {
    const { values } = this.props;

    const onLayouts = [];
    const promises = values.map((v, i) =>
      new Promise((resolve, reject) => {
        onLayouts[i] = (e) => resolve(e.nativeEvent.layout);
      })
    );
    Promise.all(promises).then(this.handleTextsLayout.bind(this));

    const optionViews = values.map((val, idx) => (
      <TouchableWithoutFeedback
        key={idx}
        onPress={() => this.handleSelected(idx)}
        onLayout={onLayouts[idx]}
      >
        <Text style={this.getTextStyle(idx)}>{val}</Text>
      </TouchableWithoutFeedback>
    ));

    return (
      <View style={styles.conatiner}>
        <View style={this.getRootStyle()}>
          <Animated.View style={this.getThumbStyle()} />
          {optionViews}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  conatiner: {
    alignItems: 'center'
  },
  root: {
    flexDirection: 'row',
    overflow: 'hidden'
  },
  thumb: {
    position: 'absolute'
  },
  text: {
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
});

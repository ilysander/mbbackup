import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import Session from '../../api/Session';
import Colors from '../../resources/constants/Colors';
import { L } from '../../resources/language';
import ActionMenu from '../ui/ActionMenu';
import ActionMenuItem from '../ui/ActionMenuItem';
import Features from '../../resources/remote/Features';
import FeedbackManager from '../feedback/FeedbackManager';
import { NavigationProp } from '@react-navigation/native';

const styles = StyleSheet.create({
  navigationButton: {
    width: 56,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    opacity: 1,
  } as ViewStyle,
});

export interface SessionMenuProps {
  navigation: NavigationProp<any, any>;
}

export interface SessionMenuState {
  isLoggedIn: boolean;
}

export default class SessionMenu extends React.Component<
  SessionMenuProps,
  SessionMenuState
> {
  state: SessionMenuState = {
    isLoggedIn: true,
  };

  actionMenu!: ActionMenu | null;

  componentDidMount() {
    this.setState({
      isLoggedIn: !!Session.accessToken,
    });
  }

  render() {
    const { navigation } = this.props;
    const { isLoggedIn } = this.state;
    if (!isLoggedIn && !Features.isAllowedTo('Feedback')) {
      return null;
    }
    return (
      <ActionMenu
        ref={ref => {
          this.actionMenu = ref;
        }}
        style={styles.navigationButton}
        imageStyle={{ width: 24, height: 24, tintColor: Colors.grey4 }}
        accessibilityLabel={'sessionmenu_actionmenu_dots'}
        imageSource={require('../../assets/images/action-bar-dots-icon.png')}
      >
        {isLoggedIn && Features.isAllowedTo('Profile') && (
          <ActionMenuItem
            accessibilityLabel={'sessionmenu_actionmenu_profile'}
            useBorder
            imageSource={require('../../assets/images/action-menu-profile-icon.png')}
            onPress={() => {
              navigation.navigate('Profile');
              this.actionMenu && this.actionMenu.close();
            }}
            title={L.sessionmenu_actionmenu_profile}
            showMore
          />
        )}
        {Features.isAllowedTo('Feedback') && (
          <ActionMenuItem
            accessibilityLabel={'sessionmenu_actionmenu_feedback'}
            useBorder={isLoggedIn}
            imageSource={require('../../assets/images/action-menu-feedback-icon.png')}
            onPress={() => {
              this.actionMenu && this.actionMenu.close();
              setTimeout(() => {
                FeedbackManager.bugReporting();
              }, 300);
            }}
            title={L.sessionmenu_actionmenu_feedback}
            showMore
          />
        )}
        {isLoggedIn && (
          <ActionMenuItem
            accessibilityLabel={'sessionmenu_actionmenu_logout'}
            imageSource={require('../../assets/images/action-menu-logout-icon.png')}
            onPress={() => {
              Session.clear();
              navigation.navigate('SignIn');
            }}
            title={L.sessionmenu_actionmenu_logout}
          />
        )}
      </ActionMenu>
    );
  }
}

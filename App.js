/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import CodePush from 'react-native-code-push';
import * as Progress from 'react-native-progress';
import RNRestart from 'react-native-restart';

const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

let totalPercent = 0;
class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
    };
  }

  onSyncStatusChange = SyncStatus => {
    switch (SyncStatus) {
      case SyncStatus.CHECKING_FOR_UPDATE:
        // Show "Checking for update" notification
        break;
      case SyncStatus.AWAITING_USER_ACTION:
        // Show "Checking for update" notification
        break;
      case SyncStatus.DOWNLOADING_PACKAGE:
        // Show "downloading" notification
        break;
      case SyncStatus.INSTALLING_UPDATE:
        // Show "installing" notification
        break;
      case SyncStatus.UPDATE_INSTALLED:
        RNRestart.Restart();
        break;
    }
  };

  onDownloadProgress = downloadProgress => {
    this.setState(
      {
        loading: true,
        tolal: downloadProgress.totalBytes,
        recived: downloadProgress.receivedBytes,
      },
      () => {
        totalPercent = (
          (parseFloat(this.state.recived) / parseFloat(this.state.tolal)) *
          100
        ).toFixed(2);
      },
    );

    if (downloadProgress.receivedBytes === downloadProgress.totalBytes) {
      this.time = setTimeout(() => {
        RNRestart.Restart();
      }, 500);
    }
    if (downloadProgress) {
      console.log(downloadProgress);
      console.log(
        'Downloading ' +
          downloadProgress.receivedBytes +
          ' of ' +
          downloadProgress,
      );
    }
  };
  async UNSAFE_componentWillMount() {
    await this.checkUpdateApp();
  }

  checkUpdateApp = async () => {
    this.setState({loading: false});
    await CodePush.sync(
      {
        updateDialog: {
          optionalInstallButtonLabel: 'Cài đặt',
          optionalIgnoreButtonLabel: 'Bỏ qua',
          title: 'Cập nhật có sẵn',
          optionalUpdateMessage: 'Đã có bản cập nhật, bạn có muốn cài đặt nó?',
        },
        installMode: CodePush.InstallMode.IMMEDIATE,
      },
      this.onSyncStatusChange,
      this.onDownloadProgress,
    );
    this.setState({loading: false});
  };

  render() {
    return this.state.loading ? (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.white,
          flex: 1,
        }}>
        <Text>Cập nhật phiên bản mới ! </Text>
        <Progress.Pie
          progress={totalPercent / 100}
          radius={55}
          borderWidth={2}
          color={Colors.primary}
          size={120}
          bgColor="#fff">
          <Text style={{fontSize: 20, textAlign: 'center'}}>
            {totalPercent}
            {'%'}{' '}
          </Text>
        </Progress.Pie>
      </View>
    ) : (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <StatusBar barStyle={'light-content'} />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={{backgroundColor: 'white'}}>
          <Header />
          <View
            style={{
              backgroundColor: Colors.white,
            }}>
            <Section title="Anh An hom nay la manh thu">
              Edit <Text style={styles.highlight}>App.js</Text> to change this
              screen and then come back to see your edits.
            </Section>
            <Section title="Thai Xoan yeu duoi - 1 con vit">
              <ReloadInstructions />
            </Section>
            <Section title="Nguyen Van Du ư ư">
              <DebugInstructions />
            </Section>
            <Section title={'Update App'}>
              <TouchableOpacity onPress={() => this.checkUpdateApp()}>
                <Text>Update App</Text>
              </TouchableOpacity>
            </Section>
            <Section title="Trung Huong hôm nay đi hương trủng">
              Read the docs to discover what to do next:
            </Section>
            <LearnMoreLinks />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});
let codePushOptions = {
  updateDialog: true,
  checkFrequency: CodePush.CheckFrequency.IMMEDIATE,
};
export default App;

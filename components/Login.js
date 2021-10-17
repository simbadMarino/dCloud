import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';


export var loginScreenFlag = true;


export default class App extends React.Component {
  state={
    nodeName:"",
    password:"",
    confPassword:""
  }
  render(){

  const handleSubmit = () => {
      //const { password, confPassword } = this.state;
      // perform all neccassary validations
      if (this.state.password !== this.state.confPassword) {
          alert("Passwords don't match");
      } else {
          alert("Passwords match");
          loginScreenFlag = false;
      }
  }

  const handleSkip = () => {

    loginScreenFlag = false;

  }
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>dCloud</Text>
        <Image source={require('./dcloud_logo.png')}
        style={{ width: 100, height: 100, marginBottom:20 }}
        />
        <View style={styles.inputView} >
          <TextInput
            style={styles.inputText}
            placeholder="Node Private Key (Optional)"
            placeholderTextColor="white"
            onChangeText={text => this.setState({nodeName:text})}/>
        </View>
        <View style={styles.inputView} >
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="New Password..."
            placeholderTextColor="white"
            onChangeText={text => this.setState({password:text})}/>
        </View>

        <View style={styles.inputView} >
          <TextInput
            secureTextEntry
            style={styles.inputText}
            placeholder="Confirm New Password..."
            placeholderTextColor="white"
            onChangeText={text => this.setState({confPassword:text})}/>
        </View>

        <TouchableOpacity style={styles.loginBtn}
        onPress={handleSubmit}
        >
          <Text style={styles.loginText}>
          LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity>
                  <Text style={styles.loginText}>Skip</Text>
                </TouchableOpacity>



      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3C3C42',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"white",
    marginBottom:10
  },
  inputView:{
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginBottom:20,
    justifyContent:"center",
    padding:20
  },
  inputText:{
    height:50,
    color:"white"
  },
  forgot:{
    color:"white",
    fontSize:11
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"black",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    color:"white"
  }
});

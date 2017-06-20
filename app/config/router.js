import React from 'react'
import { TabNavigator, StackNavigator } from 'react-navigation'
import { Icon } from 'react-native-elements'

import Login from '../screens/login/Login'
import NormalLogin from '../screens/login/NormalLogin'

import Journey from '../screens/journey/Journey'
import More from '../screens/more/More'
import Logging from '../screens/logging/Logging'
import Team from '../screens/team/Team'

import AddPost from '../screens/logging/AddPost'

// Login Page Stack
export const LoginNav = StackNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            header: false,
            test: 'test'
        }
    },
    NormalLogin: {
        screen: NormalLogin,
        navigationOptions: {
            header: false
        }
    }
})

// Tab Pages
export const TeamStack = StackNavigator({
    Team: {
        screen: Team,
        navigationOptions: {
            header: false
        }
    }
})
export const JourneyStack = StackNavigator({
    Journey: {
        screen: Journey,
        navigationOptions: {
            header: false
        }
    }
})
export const LoggingStack = StackNavigator({
    Logging: {
        screen: Logging,
        navigationOptions: {
            header: false
        }
    },
    AddPost: {
        screen: AddPost,
        navigationOptions: {
            header: false
        }
    }
})
export const MoreStack = StackNavigator({
    More: {
        screen: More,
        navigationOptions: {
            header: false
        }
    }  
})

// Tab Bar Main Container
export const Tabs = TabNavigator({
    Team: {
        screen: TeamStack,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (<Icon name="ios-home" type="ionicon" size={27} color={tintColor}/>)
        }
    },
    Journey: {
        screen: JourneyStack,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (<Icon name="ios-stats" type="ionicon" size={27} color={tintColor}/>)
        }
    },
    Logging: {
        screen: LoggingStack,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (<Icon name="ios-add-circle" type="ionicon" size={27} color={tintColor}/>)
        }
    },
    More: {
        screen: MoreStack,
        navigationOptions: {
            tabBarIcon: ({tintColor}) => (<Icon name="ios-more" type="ionicon" size={27} color={tintColor}/>)
        }
    }
},{
    tabBarOptions: {
        style: {
            backgroundColor: 'white',
            height: 50,
            padding: 0,
            margin: 0
        },
        showIcon: true,
        showLabel: false,
        activeTintColor: "#E91E63",
        inactiveTintColor: "#CCC",
        indicatorStyle: {
            backgroundColor: "white"
        }
    },
    swipeEnabled: false
}
)
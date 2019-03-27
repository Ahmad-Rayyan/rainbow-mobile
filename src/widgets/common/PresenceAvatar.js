// import React, { Component } from 'react';
// import { StyleSheet,View, Image } from 'react-native';

// import online from '../../resources/images/online.png';
// import offline from '../../resources/images/offline.png';
// import away from '../../resources/images/away.png';
// import onlineMobile from '../../resources/images/online_mobile.png';
// import dnd from '../../resources/images/dnd.png';

// export default class PresenceAvatar extends Component {

//     renderPresenceImage(presence) {
//         console.log('Contacts:renderPresenceImage', presence);
//         switch (presence) {
//             case 'online':
//                 return <Image style={styles.presenceIcon} source={online} />;
//             case 'away':
//                 return <Image style={styles.presenceIcon} source={away} />;
//             case 'mobile_online':
//                 return <Image style={styles.presenceIcon} source={onlineMobile} />;
//             case 'manual_away':
//                 return <Image style={styles.presenceIcon} source={away} />;
//             case 'DoNotDisturb':
//                 return <Image style={styles.presenceIcon} source={dnd} />;
//             case 'busy':
//                 return <Image style={styles.presenceIcon} source={dnd} />;
//             case 'busy_audio':
//                 return <Image style={styles.presenceIcon} source={dnd} />;
//             case 'busy_video':
//                 return <Image style={styles.presenceIcon} source={dnd} />;
//             default: return <Image style={styles.presenceIcon} source={offline} />;

//         }
// }
//     render() {
//         return (
//             <Image style={styles.presenceIcon} source={dnd} />
//         );
//     }
// }

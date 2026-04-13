import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {profileMenuItems} from '../utils/mockData';
import {getUserProfile, updateUserProfile, changePassword} from '../utils/api';
import Footer from '../components/Footer';
import {useAuth} from '../context/AuthContext';

/**
 * ProfileScreen — profil utilisateur, statistiques, menu et déconnexion
 */
const ProfileScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {logout, accessToken} = useAuth();
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  // Modale édition profil
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [editName, setEditName] = React.useState('');
  const [editEmail, setEditEmail] = React.useState('');
  const [editPhone, setEditPhone] = React.useState('');
  const [editLoading, setEditLoading] = React.useState(false);
  const [editError, setEditError] = React.useState('');
  // Modale changement mot de passe
  const [showPwdModal, setShowPwdModal] = React.useState(false);
  const [oldPwd, setOldPwd] = React.useState('');
  const [newPwd, setNewPwd] = React.useState('');
  const [pwdLoading, setPwdLoading] = React.useState(false);
  const [pwdError, setPwdError] = React.useState('');

  React.useEffect(() => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    console.log('[PROFILE] Appel API /users/me');
    getUserProfile(accessToken)
      .then(data => {
        console.log('[PROFILE] Réponse API /users/me:', data);
        setUser(data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [accessToken]);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  const handleMenuPress = item => {
    if (item.screen) {
      navigation.navigate(item.screen);
    }
    // ...other menu logic if needed
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header rouge */}
      <View style={[styles.profileHeader, {paddingTop: insets.top + 16}]}> 
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user && user.name ? user.name.split(' ').map(n => n[0]).join('') : ''}
          </Text>
        </View>
        <Text style={styles.userName}>{user && user.name ? user.name : ''}</Text>
        <Text style={styles.userPhone}>{user && user.phone ? user.phone : ''}</Text>
        <Text style={styles.userEmail}>{user && user.email ? user.email : ''}</Text>
        <Text style={styles.memberSince}>Membre depuis {user && user.memberSince ? user.memberSince : ''}</Text>
      </View>

      {/* MODALE ÉDITION PROFIL */}
      {showEditModal && (
        <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center',zIndex:20}}>
          <View style={{backgroundColor:'white',borderRadius:12,padding:24,width:'85%',maxWidth:350}}>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12}}>Modifier le profil</Text>
            <View style={{marginBottom:10}}>
              <Text style={{fontSize:13,marginBottom:4}}>Nom</Text>
              <TextInput value={editName} onChangeText={setEditName} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:8}} placeholder="Nom complet" />
            </View>
            <View style={{marginBottom:10}}>
              <Text style={{fontSize:13,marginBottom:4}}>Email</Text>
              <TextInput value={editEmail} onChangeText={setEditEmail} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:8}} placeholder="Email" keyboardType="email-address" />
            </View>
            <View style={{marginBottom:10}}>
              <Text style={{fontSize:13,marginBottom:4}}>Téléphone</Text>
              <TextInput value={editPhone} onChangeText={setEditPhone} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:8}} placeholder="Téléphone" keyboardType="phone-pad" />
            </View>
            {editError ? <Text style={{color:'red',marginBottom:8}}>{editError}</Text> : null}
            <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:10}}>
              <TouchableOpacity onPress={()=>setShowEditModal(false)} style={{marginRight:16}}><Text style={{color:COLORS.grey}}>Annuler</Text></TouchableOpacity>
              <TouchableOpacity onPress={async()=>{
                setEditError('');
                if(!editName||!editEmail||!editPhone){setEditError('Tous les champs sont requis');return;}
                setEditLoading(true);
                try{
                  await updateUserProfile(accessToken,{name:editName,email:editEmail,phone:editPhone});
                  setShowEditModal(false);
                  setUser({...user,name:editName,email:editEmail,phone:editPhone});
                }catch(e){setEditError(e.message);}finally{setEditLoading(false);}
              }}>
                <Text style={{color:COLORS.primary,fontWeight:'bold'}}>{editLoading?'...':'Enregistrer'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {/* MODALE CHANGEMENT MOT DE PASSE */}
      {showPwdModal && (
        <View style={{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'center',alignItems:'center',zIndex:20}}>
          <View style={{backgroundColor:'white',borderRadius:12,padding:24,width:'85%',maxWidth:350}}>
            <Text style={{fontWeight:'bold',fontSize:18,marginBottom:12}}>Changer le mot de passe</Text>
            <View style={{marginBottom:10}}>
              <Text style={{fontSize:13,marginBottom:4}}>Ancien mot de passe</Text>
              <TextInput value={oldPwd} onChangeText={setOldPwd} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:8}} placeholder="Ancien mot de passe" secureTextEntry />
            </View>
            <View style={{marginBottom:10}}>
              <Text style={{fontSize:13,marginBottom:4}}>Nouveau mot de passe</Text>
              <TextInput value={newPwd} onChangeText={setNewPwd} style={{borderWidth:1,borderColor:'#ddd',borderRadius:8,padding:8}} placeholder="Nouveau mot de passe" secureTextEntry />
            </View>
            {pwdError ? <Text style={{color:'red',marginBottom:8}}>{pwdError}</Text> : null}
            <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:10}}>
              <TouchableOpacity onPress={()=>setShowPwdModal(false)} style={{marginRight:16}}><Text style={{color:COLORS.grey}}>Annuler</Text></TouchableOpacity>
              <TouchableOpacity onPress={async()=>{
                setPwdError('');
                if(!oldPwd||!newPwd){setPwdError('Tous les champs sont requis');return;}
                setPwdLoading(true);
                try{
                  await changePassword(oldPwd,newPwd,accessToken);
                  setShowPwdModal(false);
                  setOldPwd('');setNewPwd('');
                  Alert.alert('Succès','Mot de passe changé');
                }catch(e){setPwdError(e.message);}finally{setPwdLoading(false);}
              }}>
                <Text style={{color:COLORS.primary,fontWeight:'bold'}}>{pwdLoading?'...':'Changer'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Boutons édition profil et mot de passe */}
        <View style={{flexDirection:'row',justifyContent:'center',marginTop:18,marginBottom:6}}>
          <TouchableOpacity style={{backgroundColor:COLORS.primary,padding:10,borderRadius:8,marginRight:10}} onPress={()=>{
            setEditName(user?.name||'');setEditEmail(user?.email||'');setEditPhone(user?.phone||'');setShowEditModal(true);}}>
            <Text style={{color:'white',fontWeight:'bold'}}>Modifier le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{backgroundColor:COLORS.secondary,padding:10,borderRadius:8}} onPress={()=>{setShowPwdModal(true);}}>
            <Text style={{color:'white',fontWeight:'bold'}}>Changer le mot de passe</Text>
          </TouchableOpacity>
        </View>
        {/* ——— Statistiques ——— */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user && typeof user.ordersCount === 'number' ? user.ordersCount : 0}</Text>
            <Text style={styles.statLabel}>Commandes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: COLORS.success}]}>
              {user && typeof user.repaymentRate === 'number' ? user.repaymentRate : 0}%
            </Text>
            <Text style={styles.statLabel}>Remboursement</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: COLORS.warning}]}>{user && typeof user.lateCount === 'number' ? user.lateCount : 0}</Text>
            <Text style={styles.statLabel}>Retards</Text>
          </View>
        </View>

        {/* ——— Carte score ——— */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreTitle}>Score de confiance</Text>
            <Text style={styles.scoreSub}>
              {(user && typeof user.trustLevel === 'string' ? user.trustLevel : 'N/A')}
              {' — Acompte '}
              {(user && typeof user.depositRate === 'number' ? user.depositRate : 0)}
            </Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNum}>{user && typeof user.trustScore === 'number' ? user.trustScore : 0}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
        </View>

        {/* ——— Menu ——— */}
        <View style={styles.menuCard}>
          {profileMenuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => handleMenuPress(item)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ——— Déconnexion ——— */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <Footer />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, overflow: 'hidden', backgroundColor: COLORS.background},
  scroll: {flex: 1},
  profileHeader: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 4,
  },
  backIcon: {fontSize: 22, color: COLORS.white, fontWeight: 'bold'},
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userName: {fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginBottom: 4},
  userPhone: {fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 2},
  userEmail: {fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4},
  memberSince: {fontSize: 12, color: 'rgba(255,255,255,0.65)'},
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },
  statBox: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: 22, fontWeight: 'bold', color: COLORS.text},
  statLabel: {fontSize: 11, color: COLORS.grey, marginTop: 4, textAlign: 'center'},
  statDivider: {width: 1, backgroundColor: COLORS.border},
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    overflow: 'hidden',
  },
  scoreLeft: {
    flex: 1,
    minWidth: 0,
  },
  scoreTitle: {color: COLORS.white, fontWeight: 'bold', fontSize: 15, marginBottom: 4},
  scoreSub: {color: 'rgba(255,255,255,0.85)', fontSize: 13},
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: {color: COLORS.white, fontSize: 22, fontWeight: 'bold'},
  scoreMax: {color: 'rgba(255,255,255,0.7)', fontSize: 11},
  menuCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {fontSize: 20, marginRight: 14, width: 28, textAlign: 'center'},
  menuLabel: {flex: 1, fontSize: 15, color: COLORS.text},
  menuArrow: {fontSize: 20, color: COLORS.grey},
  logoutBtn: {
    margin: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  logoutText: {color: COLORS.primary, fontWeight: 'bold', fontSize: 15},
  bottomSpacer: {height: 30},
});

export default ProfileScreen;

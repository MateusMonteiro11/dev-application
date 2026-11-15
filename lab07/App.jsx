import React, { useState } from 'react';
import { Alert, Platform, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const avisar = (titulo, mensagem) => {
  if (Platform.OS === 'web') window.alert(titulo + ': ' + mensagem);
  else Alert.alert(titulo, mensagem);
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const CHAVE_USUARIOS = '@lista_filmes:usuarios';

const filmes = [
  { id: '1', titulo: 'Interestelar', ano: '2014', sinopse: 'Um grupo de astronautas viaja pelo espaço em busca de um novo lar para a humanidade.' },
  { id: '2', titulo: 'O Rei Leão', ano: '1994', sinopse: 'O jovem leão Simba precisa enfrentar seu passado para assumir seu lugar como rei.' },
  { id: '3', titulo: 'Divertida Mente', ano: '2015', sinopse: 'As emoções de Riley tentam ajudá-la a lidar com as mudanças em sua vida.' },
];

function Botao({ titulo, onPress }) {
  return (
    <TouchableOpacity accessibilityRole="button" style={estilos.botao} onPress={onPress}>
      <Text style={estilos.textoBotao}>{titulo}</Text>
    </TouchableOpacity>
  );
}

function Formulario({ cadastro, aoEntrar, navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function enviar() {
    const emailNormalizado = email.trim().toLowerCase();
    if (!emailNormalizado || !senha.trim()) {
      avisar('Atenção', 'Preencha o e-mail e a senha.');
      return;
    }

    try {
      const dados = await AsyncStorage.getItem(CHAVE_USUARIOS);
      const usuarios = dados ? JSON.parse(dados) : [];
      const usuario = usuarios.find((item) => item.email === emailNormalizado);

      if (cadastro) {
        if (usuario) {
          avisar('Atenção', 'Este e-mail já está cadastrado.');
          return;
        }
        await AsyncStorage.setItem(CHAVE_USUARIOS, JSON.stringify([...usuarios, { email: emailNormalizado, senha }]));
        setEmail('');
        setSenha('');
        avisar('Cadastro realizado', 'Agora faça login para acessar os filmes.');
        navigation.navigate('Login');
      } else if (usuario && usuario.senha === senha) {
        setSenha('');
        aoEntrar();
      } else {
        avisar('Login inválido', 'Confira o e-mail e a senha.');
      }
    } catch (erro) {
      avisar('Erro', 'Não foi possível acessar os dados. Tente novamente.');
    }
  }

  return (
    <View style={estilos.formulario}>
      <Text style={estilos.titulo}>{cadastro ? 'Cadastro' : 'Login'}</Text>
      <TextInput style={estilos.input} placeholder="E-mail" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput style={estilos.input} placeholder="Senha" value={senha} onChangeText={setSenha} secureTextEntry />
      <Botao titulo={cadastro ? 'Cadastrar' : 'Entrar'} onPress={enviar} />
    </View>
  );
}

function Filmes({ navigation, aoSair }) {
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Filmes</Text>
      <FlatList
        data={filmes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={estilos.filme} onPress={() => navigation.navigate('Sinopse', { filme: item })}>
            <Text style={estilos.nomeFilme}>{item.titulo}</Text>
            <Text>{item.ano}</Text>
          </TouchableOpacity>
        )}
      />
      <Botao titulo="Sair" onPress={aoSair} />
    </View>
  );
}

function Sinopse({ route, navigation }) {
  const { filme } = route.params;
  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>{filme.titulo}</Text>
      <Text style={estilos.ano}>{filme.ano}</Text>
      <Text style={estilos.sinopse}>{filme.sinopse}</Text>
      <View style={estilos.retorno}>
        <Botao titulo="Voltar para filmes" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

function AbasAcesso({ state, navigation }) {
  return (
    <View style={estilos.abas}>
      {state.routes.map((route, index) => {
        const selecionada = state.index === index;
        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: selecionada }}
            style={[estilos.aba, selecionada && estilos.abaSelecionada]}
            onPress={() => {
              const evento = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!selecionada && !evento.defaultPrevented) navigation.navigate(route.name);
            }}
          >
            <Text style={[estilos.textoAba, selecionada && estilos.textoAbaSelecionada]}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function Acesso({ aoEntrar }) {
  return (
    <ScrollView contentContainerStyle={estilos.fundoAcesso}>
      <View style={estilos.modalAcesso}>
        <Tab.Navigator initialRouteName="Login" tabBar={(props) => <AbasAcesso {...props} />} screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Login">{(props) => <Formulario {...props} aoEntrar={aoEntrar} />}</Tab.Screen>
          <Tab.Screen name="Cadastro">{(props) => <Formulario {...props} cadastro />}</Tab.Screen>
        </Tab.Navigator>
      </View>
    </ScrollView>
  );
}

export default function App() {
  const [logado, setLogado] = useState(false);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {logado ? (
          <>
            <Stack.Screen name="Filmes" options={{ headerShown: false }}>
              {(props) => <Filmes {...props} aoSair={() => setLogado(false)} />}
            </Stack.Screen>
            <Stack.Screen name="Sinopse" component={Sinopse} options={{ headerShown: false }} />
          </>
        ) : (
          <Stack.Screen name="Acesso" options={{ headerShown: false }}>
            {() => <Acesso aoEntrar={() => setLogado(true)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60, backgroundColor: '#fff' },
  fundoAcesso: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#edf0f5' },
  modalAcesso: { width: '100%', maxWidth: 400, height: 380, borderRadius: 12, overflow: 'hidden', backgroundColor: '#fff' },
  formulario: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#fff' },
  abas: { flexDirection: 'row', gap: 12, padding: 16, backgroundColor: '#fff' },
  aba: { flex: 1, minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: '#3157a4' },
  abaSelecionada: { backgroundColor: '#3157a4' },
  textoAba: { color: '#3157a4', fontWeight: 'bold' },
  textoAbaSelecionada: { color: '#fff' },
  retorno: { marginTop: 24 },
  titulo: { fontSize: 28, fontWeight: 'bold', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 12, marginBottom: 12 },
  botao: { backgroundColor: '#3157a4', padding: 14, borderRadius: 6, alignItems: 'center' },
  textoBotao: { color: '#fff', fontWeight: 'bold' },
  filme: { padding: 16, borderWidth: 1, borderColor: '#ddd', borderRadius: 6, marginBottom: 12 },
  nomeFilme: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  ano: { marginBottom: 16, color: '#666' },
  sinopse: { fontSize: 16, lineHeight: 24 },
});

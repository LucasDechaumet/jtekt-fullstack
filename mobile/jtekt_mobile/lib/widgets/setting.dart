import 'package:flutter/material.dart';
import 'package:jtekt_mobile/api/api.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Setting extends StatefulWidget {
  const Setting({super.key});

  @override
  State<StatefulWidget> createState() => _SettingState();
}

class _SettingState extends State<Setting> {
  final TextEditingController adressController = TextEditingController();
  bool isLoading = false;
  bool ipAddressIsValid = false;
  String validationMessage = '';
  String fullUrl = '';

  @override
  void initState() {
    super.initState();
    _loadIpAddress();
  }

  Future<void> _loadIpAddress() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    String? savedIpAddress = prefs.getString('ipAddress');
    setState(() {
      adressController.text = savedIpAddress!;
    });
  }

  Future<void> _setIpAddress(String ip) async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString('ipAddress', ip);
  }

  Future<void> _validateIpAddress() async {
    setState(() {
      isLoading = true;
    });
    String ip = adressController.text;
    bool isValid = await Api.testIpAddress(ip);
    setState(() {
      isLoading = false;
      ipAddressIsValid = isValid;
      validationMessage = isValid
          ? 'Adresse IP valide'
          : 'Adresse IP invalide ou port incorrect';
    });

    if (isValid) {
      _setIpAddress(ip);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              TextField(
                controller: adressController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: "Adresse IP et port du serveur",
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _validateIpAddress,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.pink,
                ),
                child: isLoading
                    ? const CircularProgressIndicator(
                        valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                      )
                    : const Text(
                        "Tester la connexion",
                        style: TextStyle(color: Colors.white),
                      ),
              ),
              const SizedBox(height: 20),
              Text(
                validationMessage,
                style: TextStyle(
                  color: ipAddressIsValid ? Colors.green : Colors.red,
                ),
              ),
              const SizedBox(height: 20),
              // Affiche l'URL complète
              if (fullUrl.isNotEmpty)
                Text(
                  'URL complète : $fullUrl', // Affiche l'URL complète ici
                  style: const TextStyle(fontSize: 14, color: Colors.black),
                ),
              const SizedBox(height: 200),
              const Text("tc_means v1.0 by Akensys"),
            ],
          ),
        ),
      ),
    );
  }
}

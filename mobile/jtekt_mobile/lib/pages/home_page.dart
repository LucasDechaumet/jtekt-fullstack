import 'package:flutter/material.dart';
import 'package:jtekt_mobile/api/api.dart';
import 'package:jtekt_mobile/widgets/mean.dart';
import 'package:jtekt_mobile/widgets/setting.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;

  @override
  void initState() {
    Api.monitorBatteryState();
    super.initState();
  }

  static const List<Widget> _widget = <Widget>[Mean(), Setting()];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          "TC_MEANS : Gestion des moyens",
          style: TextStyle(fontSize: 20),
        ),
        centerTitle: true,
      ),
      body: Container(
        child: _widget.elementAt(_selectedIndex),
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: "Saisie",
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.settings),
            label: "Paramètre",
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}

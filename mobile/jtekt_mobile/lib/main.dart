import 'package:flutter/material.dart';
import 'package:jtekt_mobile/core/themes/light_theme.dart';
import 'package:jtekt_mobile/pages/home_page.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: lightTheme,
      darkTheme: lightTheme,
      themeMode: ThemeMode.light,
      home: const Scaffold(
        body: HomePage(),
      ),
      title: "TC_MEANS",
    );
  }
}

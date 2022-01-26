#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include "fractalglwidget.h"

#include <QMainWindow>

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
  Q_OBJECT

public:
  MainWindow(QWidget *parent = nullptr);
  ~MainWindow();

public slots:
  void reloadPressed();
  void changedSteps(int pos);
  void changedPolyOrder(int pos);
  void addPolyOrder();
  void rmPolyOrder();

private slots:
  void on_checkBox_stateChanged(int arg1);

private:
  void newSlider(int i);
  Ui::MainWindow *ui;
  FractalGLWidget* fw;
  QHash<QObject*, int> polySliders;
  QHash<int, std::array<QObject*, 3>> polySB;
  int polyOrder = 0;
};
#endif // MAINWINDOW_H

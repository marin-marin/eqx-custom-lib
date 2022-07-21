const ecmScript = document.createElement('script');
ecmScript.src = 'https://test-asset.eqxiu.cn/libs/custom-lib/test/0.0.2.js';
ecmScript.onload = () => {
    const _ecm = window._EqxCustomManager;

    // 事件监听
    _ecm.listenerService.registerDep('load:start', () => {
        console.log('[register] => LOAD - START');
    });
    _ecm.listenerService.registerDep('load:end', () => {
        console.log('[register] => LOAD - END');
        // 场景控制
        setTimeout(() => {
            const ctrlSrv = _ecm.controlService;
            ctrlSrv.execCmd('toPage', 2);
        });
    });
    _ecm.listenerService.registerDep('page:prev', () => {
        console.log('[register] => PAGE - PREV');
    });
    _ecm.listenerService.registerDep('page:next', () => {
        console.log('[register] => PAGE - NEXT');
    });

    // 弹窗使用
    const dialog = _ecm.dialogService;
    const d1 = dialog.showDialog({
        title: '标题',
        content: '内容内容内容内容内容内容内容内容',
        onHide: () => {
            console.log('弹窗关闭');
        },
        onRemove: () => {
            console.log('弹窗销毁');
        },
    });

    // TODO: 组件控制
    const pageList = window._EqxCustomManager.pageService.getPageList()
    // 测试1， 更新所有页面的文本
    pageList.forEach((page: any) => {
      const compList = page.compService.getCompList()
      const textCompIds = compList.filter((comp: any) => comp.type === '7').map(({ id }: any) => id )
      page.compService.update(textCompIds, {
        content: 'lalalalalal',
        css: {
          color: 'red',
          fontSize: 30
        }
      })
  
      const imageCompIds = compList.filter((comp: any) => comp.type === 4).map(({id}: any) => id)
      page.compService.update(imageCompIds, {
        src: "http://test-asset.eqxiu.cn/2e6ebbecdf4f41f28873afe5f3616905/099b0da5aa9a4e7a903ee07e50daf844?imageMogr2/format/webp/quality/80/thumbnail/204x",
        css: {
          width: 200,
          height: 200
        }
      })
    })

};
document.body?.appendChild(ecmScript)
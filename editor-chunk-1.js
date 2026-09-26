    renderStringList(container, array, rerender);
    }
    $(buttonId).addEventListener('click', function () {
      array.push('');
      rerender();
      markDirty();
    });
    rerender();
  }
  function bindField(id, object, key, isTextarea) {
    const element = $(id);
    const setter = function (value) {
      object[key] = value;
    };
    element.value = object[key] == null ? '' : String(object[key]);
    element.addEventListener('input', function () {
      setter(element.value);
      markDirty();
    });
    if (isTextarea) {
      element.rows = 4;
    }
  }
  
  bindField('home-title', data.home, 'title', false);
  bindField('home-lead', data.home, 'lead', true);
  bindField('home-warning', data.home, 'warning', true);
  
  bindField('uof-intro', data.uof, 'intro', true);
  setupTextareaList('uof-rules', data.uof.rules, 'add-uof-rule');
  
  bindField('quota-intro', data.policies, 'quotaIntro', true);
  bindField('senior-high', data.policies, 'seniorHigh', false);
  bindField('high', data.policies, 'high', false);
  bindField('middle', data.policies, 'middle', false);
  bindField('low', data.policies, 'low', false);
  bindField('missed', data.policies, 'missed', true);
  bindField('promo', data.policies, 'promo', true);
  bindField('loa', data.policies, 'loa', true);
  
  bindField('retirement-text', data.retirement, 'text', true);
  
  bindField('weapon-note', data.equipment, 'weaponNote', true);
  setupStringList(
    'uniforms',
    data.equipment.uniforms,
    'add-uniform'
  );
  setupStringList(
    'loadout',
    data.equipment.loadout,
    'add-loadout'
  );
  setupStringList(
    'default-weapons',
    data.equipment.defaultWeapons,
    'add-default-weapon'
  );
  setupStringList(
    'class2',
    data.equipment.class2,
    'add-class2'
  );
  setupStringList(
    'class3',
    data.equipment.class3,
    'add-class3'
  );
  
  bindField('vehicle-high-command', data.vehicles, 'highCommand', true);
  bindField('vehicle-misc', data.vehicles, 'misc', true);
  bindField('vehicle-undercover', data.vehicles, 'undercover', true);
  setupStringList(
    'vehicles-low',
    data.vehicles.low,
    'add-vehicle-low'
  );
  setupStringList(
    'vehicles-middle',
    data.vehicles.middle,
    'add-vehicle-middle'
  );
  setupStringList(
    'vehicles-high',
    data.vehicles.high,
    'add-vehicle-high'
  );
  
  setupRankList(
    'ranks-command',
    data.ranks.command,
    'add-rank-command'
  );
  setupRankList(
    'ranks-high-command',
    data.ranks.highCommand,
    'add-rank-high-command'
  );
  setupRankList(
    'ranks-high-rank',
    data.ranks.highRank,
    'add-rank-high-rank'
  );
  setupRankList(
    'ranks-supervisor',
    data.ranks.supervisor,
    'add-rank-supervisor'
  );
  setupRankList(
    'ranks-low-rank',
    data.ranks.lowRank,
    'add-rank-low-rank'
  );
  
  bindField('response-code1', data.response, 'code1', false);
  bindField('response-code2', data.response, 'code2', false);
  bindField('response-code3', data.response, 'code3', false);
  bindField('response-code4', data.response, 'code4', false);
  bindField('response-code5', data.response, 'code5', false);
  
  setupCommandList();
  
  setupTenCodes();
  
  $('cancel').addEventListener('click', function () {
    if (!dirty || confirm('Discard unsaved changes?')) {
      location.replace('home.html?flash=' + encodeURIComponent('Canceled'));
    }
  });
  
  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    validation.textContent = '';
    const validationError = SEUContent.validate(data);
    if (validationError) {
      validation.textContent = validationError;
      validation.className = 'editor-status err';
      return;
    }
    const publishButton = $('publish');
    publishButton.disabled = true;
    status.textContent = 'Publishing…';
    status.className = 'editor-status';
    try {
      SEUContent.saveDraft(data);
      const result = await SEUContent.publish(data);
      if (!result.ok) {
        status.textContent =
          result.error || 'Publishing failed.';
        status.className = 'editor-status err';
        publishButton.disabled = false;
        return;
      }
      dirty = false;
      status.textContent = 'Saved successfully';
      status.className = 'editor-status ok';
      location.replace('home.html?flash=' + encodeURIComponent('Saved successfully'));
    } catch (error) {
      status.textContent =
        error && error.message
          ? error.message
          : 'Publishing failed.';
      status.className = 'editor-status err';
      publishButton.disabled = false;
    }
  });
})();

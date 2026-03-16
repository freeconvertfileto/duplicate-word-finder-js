(function() {
    var inputEl = document.getElementById('dupwordInput');
    var findBtn = document.getElementById('dupwordFind');
    var clearBtn = document.getElementById('dupwordClear');
    var statusEl = document.getElementById('dupwordStatus');
    var resultsEl = document.getElementById('dupwordResults');
    var listEl = document.getElementById('dupwordList');
    var caseSensitiveEl = document.getElementById('dupwordCaseSensitive');
    var ignoreCommonEl = document.getElementById('dupwordIgnoreCommon');

    var COMMON_WORDS = {
        'the': 1, 'a': 1, 'an': 1, 'is': 1, 'are': 1, 'was': 1, 'were': 1,
        'be': 1, 'been': 1, 'being': 1, 'have': 1, 'has': 1, 'had': 1,
        'do': 1, 'does': 1, 'did': 1, 'will': 1, 'would': 1, 'could': 1,
        'should': 1, 'may': 1, 'might': 1, 'can': 1, 'shall': 1,
        'of': 1, 'in': 1, 'on': 1, 'at': 1, 'to': 1, 'for': 1, 'with': 1,
        'by': 1, 'from': 1, 'up': 1, 'about': 1, 'into': 1, 'through': 1,
        'and': 1, 'or': 1, 'but': 1, 'not': 1, 'so': 1, 'yet': 1, 'nor': 1,
        'this': 1, 'that': 1, 'these': 1, 'those': 1, 'it': 1, 'its': 1,
        'i': 1, 'me': 1, 'my': 1, 'we': 1, 'our': 1, 'you': 1, 'your': 1,
        'he': 1, 'she': 1, 'they': 1, 'them': 1, 'his': 1, 'her': 1,
        'their': 1, 'as': 1, 'if': 1, 'when': 1, 'than': 1, 'then': 1
    };

    function setStatus(msg, type) {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.className = 'code-status ' + (type || '');
    }

    function findDuplicates() {
        if (!inputEl) return;
        var text = inputEl.value;
        if (!text.trim()) {
            setStatus('Please enter some text.', 'error');
            return;
        }

        var caseSensitive = caseSensitiveEl && caseSensitiveEl.checked;
        var ignoreCommon = ignoreCommonEl && ignoreCommonEl.checked;

        var wordRegex = /[a-zA-Z\u00C0-\u024F]+(?:'[a-zA-Z]+)?/g;
        var matches = text.match(wordRegex);
        if (!matches || matches.length === 0) {
            setStatus('No words found in the text.', 'info');
            resultsEl.style.display = 'none';
            return;
        }

        var wordMap = {};
        var positions = {};
        var pos = 1;
        for (var i = 0; i < matches.length; i++) {
            var raw = matches[i];
            var key = caseSensitive ? raw : raw.toLowerCase();
            if (ignoreCommon && COMMON_WORDS[key]) {
                pos++;
                continue;
            }
            if (!wordMap[key]) {
                wordMap[key] = 0;
                positions[key] = [];
            }
            wordMap[key]++;
            positions[key].push(pos);
            pos++;
        }

        var duplicates = [];
        for (var word in wordMap) {
            if (wordMap[word] > 1) {
                duplicates.push({ word: word, count: wordMap[word], pos: positions[word] });
            }
        }

        duplicates.sort(function(a, b) { return b.count - a.count; });

        if (duplicates.length === 0) {
            setStatus('No duplicate words found.', 'success');
            resultsEl.style.display = 'none';
            return;
        }

        setStatus('Found ' + duplicates.length + ' duplicate word' + (duplicates.length !== 1 ? 's' : '') + '.', 'success');
        listEl.innerHTML = '';
        for (var j = 0; j < duplicates.length; j++) {
            var d = duplicates[j];
            var item = document.createElement('div');
            item.className = 'dupword-result-item';
            var posStr = d.pos.slice(0, 10).join(', ') + (d.pos.length > 10 ? '...' : '');
            item.innerHTML = '<span class="dupword-result-word">' + escapeHtml(d.word) + '</span>' +
                '<span class="dupword-result-count">x' + d.count + '</span>' +
                '<span class="dupword-result-positions">positions: ' + escapeHtml(posStr) + '</span>';
            listEl.appendChild(item);
        }
        resultsEl.style.display = 'block';
    }

    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    if (findBtn) {
        findBtn.addEventListener('click', findDuplicates);
    }

    if (inputEl) {
        inputEl.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                findDuplicates();
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (inputEl) inputEl.value = '';
            if (listEl) listEl.innerHTML = '';
            if (resultsEl) resultsEl.style.display = 'none';
            setStatus('', '');
        });
    }
})();
